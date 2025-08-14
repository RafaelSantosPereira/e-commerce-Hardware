const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const pool = require('./db');

const app = express();
const PORT = 3000;

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(express.json());

//
app.get('/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM product');
    res.json(result.rows);
  } catch (error) {
    console.error('Erro na query:', error);
    res.status(500).send('Erro ao buscar produtos');
  }
});


//seleciona todos os produtos de uma categoria
app.get('/products/category/id/:categoryId', async (req, res) => {
  const { categoryId } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM product WHERE category_id = $1`,
      [categoryId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar produtos por category_id:', error);
    res.status(500).send('Erro ao buscar produtos por category_id');
  }
});

//destalhes de um produto
app.get('/products/:id/details', async (req, res) => {
  const { id } = req.params;
  try {
    //informaçao basica
    const productResult = await pool.query(
      `SELECT id, name, price, image_url FROM product WHERE id = $1`,
      [id]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    const product = productResult.rows[0];
    //specs do produto
    const specsResult = await pool.query(
      `SELECT spec_key, spec_value FROM product_specs WHERE product_id = $1`,
      [id]
    );

    const specs = specsResult.rows;

    res.json({ product, specs });
  } catch (error) {
    console.error('Erro ao buscar detalhes do produto:', error);
    res.status(500).send('Erro ao buscar detalhes do produto');
  }
});



// Criar conta e enviar token de verificação
app.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  
  try {
    // Verificar se email já existe
    const exists = await pool.query('SELECT id FROM user_auth WHERE email = $1', [email]);
    if (exists.rows.length > 0) {
      return res.status(400).json({ message: 'Email já registado' });
    }

    // Criar user base
    const userResult = await pool.query(
      'INSERT INTO users (name, role) VALUES ($1, $2) RETURNING id',
      [name, role || 'customer']
    );

    const userId = userResult.rows[0].id;

    // Criar autenticação
    const passwordHash = await bcrypt.hash(password, 10);
    const token = uuidv4();
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    await pool.query(
      `INSERT INTO user_auth (user_id, email, password_hash, is_verified, verify_token, verify_token_expires)
       VALUES ($1, $2, $3, false, $4, $5)`,
      [userId, email, passwordHash, token, tokenExpiry]
    );

    // Aqui enviarias o email de verificação (Nodemailer)
    console.log(`Enviar email de verificação: http://localhost:3000/verify/${token}`);

    res.status(201).json({ message: 'Conta criada. Verifique o seu email.' });
  } catch (error) {
    console.error('Erro no registo:', error);
    res.status(500).send('Erro no registo');
  }
});


app.get('/verify/:token', async (req, res) => {
  const { token } = req.params;

  try {
    const user = await pool.query(
      'SELECT id FROM user_auth WHERE verify_token = $1 AND verify_token_expires > NOW()',
      [token]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Token inválido ou expirado' });
    }

    await pool.query(
      'UPDATE user_auth SET is_verified = true, verify_token = null, verify_token_expires = null WHERE verify_token = $1',
      [token]
    );

    res.send('Email verificado com sucesso. Já pode fazer login.');
  } catch (error) {
    console.error('Erro na verificação:', error);
    res.status(500).send('Erro na verificação');
  }
});


app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM user_auth WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Email ou password incorretos' });
    }

    const user = result.rows[0];

    if (!user.is_verified) {
      return res.status(403).json({ message: 'Conta não verificada. Verifique o seu email.' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(400).json({ message: 'Email ou password incorretos' });
    }

    await pool.query(
      'UPDATE user_auth SET last_login = NOW() WHERE id = $1',
      [user.id]
    );

    res.json({ message: 'Login bem-sucedido', userId: user.user_id });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).send('Erro no login');
  }
});




app.listen(PORT, () => {
  console.log(`Servidor a correr na porta ${PORT}`);
});
