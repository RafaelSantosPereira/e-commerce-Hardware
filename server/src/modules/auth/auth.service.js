const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const pool = require('../../config/db');
const resend = require('../../config/resend');

// Envia o link utilizado para confirmar uma conta.
async function sendVerificationEmail(email, name, token) {
  const verifyUrl = `${process.env.SERVER_URL || 'http://localhost:3000'}/verify/${token}`;
  return resend.emails.send({
    from: '"CompuStore" <compustore@rafaelpereira.site>',
    to: email,
    subject: 'Confirme o seu email',
    html: `
      <h2>Bem-vindo à CompuStore, ${name}!</h2>
      <p>Para ativar a sua conta, clique no botão abaixo:</p>
      <a href="${verifyUrl}">Ativar Conta</a>
      <p>Este link é válido por 24 horas.</p>
    `,
  });
}

// Cria uma conta ou atualiza uma conta ainda não verificada.
async function register({ name, email, password, role }) {
  const verified = await pool.query(
    'SELECT id FROM user_auth WHERE email = $1 AND is_verified = true',
    [email]
  );
  if (verified.rows.length > 0) {
    throw Object.assign(new Error('Email já registado'), { status: 400 });
  }

  const notVerified = await pool.query(
    'SELECT id, user_id FROM user_auth WHERE email = $1 AND is_verified = false',
    [email]
  );
  const passwordHash = await bcrypt.hash(password, 10);
  const token = uuidv4();
  const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

  if (notVerified.rows.length > 0) {
    const { id: authId, user_id: userId } = notVerified.rows[0];
    await pool.query(
      'UPDATE user_auth SET password_hash = $1, verify_token = $2, verify_token_expires = $3 WHERE id = $4',
      [passwordHash, token, tokenExpiry, authId]
    );
    await pool.query('UPDATE users SET name = $1 WHERE id = $2', [name, userId]);
  } else {
    const userResult = await pool.query(
      'INSERT INTO users (name, role) VALUES ($1, $2) RETURNING id',
      [name, role || 'customer']
    );
    await pool.query(
      'INSERT INTO user_auth (user_id, email, password_hash, is_verified, verify_token, verify_token_expires) VALUES ($1, $2, $3, false, $4, $5)',
      [userResult.rows[0].id, email, passwordHash, token, tokenExpiry]
    );
  }

  await sendVerificationEmail(email, name, token);
}

// Marca uma conta como verificada através do token recebido por email.
async function verify(token) {
  const user = await pool.query(
    'SELECT id FROM user_auth WHERE verify_token = $1 AND verify_token_expires > NOW()',
    [token]
  );
  if (user.rows.length === 0) {
    throw Object.assign(new Error('Token inválido ou expirado'), { status: 400 });
  }
  await pool.query(
    'UPDATE user_auth SET is_verified = true, verify_token = null, verify_token_expires = null WHERE verify_token = $1',
    [token]
  );
}

// Gera e envia um novo token para uma conta pendente.
async function resendVerification(email) {
  const result = await pool.query(
    `SELECT ua.id, ua.is_verified, u.name FROM user_auth ua JOIN users u ON ua.user_id = u.id WHERE ua.email = $1`,
    [email]
  );
  if (result.rows.length === 0) {
    return;
  }
  const user = result.rows[0];
  if (user.is_verified) {
    throw Object.assign(new Error('Esta conta já está verificada. Faça login normalmente.'), { status: 400 });
  }
  const token = uuidv4();
  const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await pool.query('UPDATE user_auth SET verify_token = $1, verify_token_expires = $2 WHERE id = $3', [token, tokenExpiry, user.id]);
  await sendVerificationEmail(email, user.name, token);
}

// Valida as credenciais e cria o JWT da sessão.
async function login(email, password) {
  const result = await pool.query(
    `SELECT ua.*, u.role, u.name FROM user_auth ua JOIN users u ON ua.user_id = u.id WHERE ua.email = $1`,
    [email]
  );
  if (result.rows.length === 0) {
    throw Object.assign(new Error('Email ou password incorretos'), { status: 400 });
  }

  const user = result.rows[0];
  if (!user.is_verified) {
    throw Object.assign(new Error('Conta não verificada. Verifique o seu email.'), { status: 403 });
  }

  const passwordMatches = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatches) {
    throw Object.assign(new Error('Email ou password incorretos'), { status: 400 });
  }

  await pool.query('UPDATE user_auth SET last_login = NOW() WHERE id = $1', [user.id]);

  return {
    token: jwt.sign(
      { id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    ),
    name: user.name,
    role: user.role,
  };
}

// Obtém os dados públicos da sessão atual.
async function getSession(userId) {
  const result = await pool.query(
    'SELECT name, role FROM users WHERE id = $1',
    [userId]
  );

  return result.rows[0] || null;
}

module.exports = { register, verify, resendVerification, login, getSession };
