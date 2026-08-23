const authService = require('./auth.service');

function handleError(res, error, fallback) {
  console.error(error);
  res
    .status(error.status || 500)
    .json({ message: error.status ? error.message : fallback });
}

// Regista uma nova conta.
async function register(req, res) {
  try {
    await authService.register(req.body);
    res.status(201).json({ message: 'Verifique o seu email para confirmar a criação da conta.' });
  } catch (error) {
    handleError(res, error, 'Erro no registo');
  }
}

// Processa o link de confirmação enviado por email.
async function verify(req, res) {
  try {
    await authService.verify(req.params.token);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?verified=success`);
  } catch (error) {
    handleError(res, error, 'Erro na verificação');
  }
}

// Reenvia o email de confirmação.
async function resendVerification(req, res) {
  if (!req.body.email) {
    return res.status(400).json({ message: 'Email é obrigatório' });
  }

  try {
    await authService.resendVerification(req.body.email);
    res.json({ message: 'Email de verificação reenviado com sucesso. Verifique a sua caixa de correio.' });
  } catch (error) {
    handleError(res, error, 'Erro ao reenviar email de verificação');
  }
}

// Autentica o utilizador e devolve os dados da sessão.
async function login(req, res) {
  try {
    const result = await authService.login(req.body.email, req.body.password);
    res.json({ message: 'Login bem-sucedido', ...result });
  } catch (error) {
    handleError(res, error, 'Erro no login');
  }
}

module.exports = { register, verify, resendVerification, login };
