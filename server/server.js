const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const pool = require('./db');
const jwt = require("jsonwebtoken");
require('dotenv').config();
const { Resend } = require('resend');

const app = express();
const PORT = process.env.PORT || 3000;

// Detectar ambiente
const isProduction = process.env.NODE_ENV === 'production';

const resend = new Resend(process.env.RESEND_API_KEY);


app.use(cors({
  origin: isProduction 
    ? process.env.FRONTEND_URL   
    : 'http://localhost:5173',   // ambiente local
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(express.json());


async function sendVerificationEmail(email, name, token) {
  try {
    const verifyUrl = `${process.env.SERVER_URL || 'http://localhost:3000'}/verify/${token}`;
    
    const resendResponse = await resend.emails.send({
    from: '"CompuStore" <compustore@rafaelpereira.site>',
    to: email,
    subject: 'Confirme o seu email',
    html: `
      <h2>Bem-vindo à CompuStore, ${name}!</h2>
      <p>Para ativar a sua conta, clique no botão abaixo:</p>
      
      <a href="${verifyUrl}" 
        style="
          display: inline-block;
          padding: 12px 20px;
          background-color: #1a73e8;
          color: #ffffff;
          text-decoration: none;
          border-radius: 6px;
          font-weight: bold;
          font-size: 16px;
          margin: 14px 0;
        ">
        Ativar Conta
      </a>

      <p>Este link é válido por 24 horas.</p>
    `,
  });

    console.log("Email de verificação enviado para:", email);
    return resendResponse;
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    throw error;
  }
}


app.get('/', (req, res) => {
  res.send(`API online em modo ${isProduction ? 'Produção' : 'Desenvolvimento'}`);
});


app.get('/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM product');
    res.json(result.rows);
  } catch (error) {
    console.error('Erro na query:', error);
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
    const productResult = await pool.query(
      `SELECT id, name, price, image_url FROM product WHERE id = $1`,
      [id]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    const product = productResult.rows[0];
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

app.get('/products/search', async (req, res) => {
  try {
    const { searchQuery } = req.query; 

    const result = await pool.query(
      'SELECT * FROM product WHERE name ILIKE $1', 
      [`%${searchQuery}%`] 
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});




// Criar conta e enviar token de verificação
app.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  
  try {
    // Verificar se email já existe e está verificado
    const verified = await pool.query(
      'SELECT id FROM user_auth WHERE email = $1 AND is_verified = true',
      [email]
    );
    if (verified.rows.length > 0) {
      return res.status(400).json({ message: 'Email já registado' });
    }

    // Verificar se email existe mas não está verificado
    const notVerified = await pool.query(
      'SELECT id, user_id FROM user_auth WHERE email = $1 AND is_verified = false',
      [email]
    );

    if (notVerified.rows.length > 0) {
      // Email existe mas não está verificado - fazer UPDATE
      const userAuthId = notVerified.rows[0].id;
      const userId = notVerified.rows[0].user_id;

      const passwordHash = await bcrypt.hash(password, 10);
      const token = uuidv4();
      const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

      // Atualizar user_auth com nova password e novo token
      await pool.query(
        `UPDATE user_auth 
         SET password_hash = $1, verify_token = $2, verify_token_expires = $3
         WHERE id = $4`,
        [passwordHash, token, tokenExpiry, userAuthId]
      );

      // Atualizar nome do user (caso tenha mudado)
      await pool.query(
        `UPDATE users SET name = $1 WHERE id = $2`,
        [name, userId]
      );

      // Enviar email usando a função reutilizável
      await sendVerificationEmail(email, name, token);

      return res.status(200).json({ 
        message: 'Email de verificação reenviado. Verifique o seu email para confirmar a criação da conta.' 
      });
    }

    // Email não existe - criar nova conta
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

    // Enviar email usando a função reutilizável
    await sendVerificationEmail(email, name, token);

    res.status(201).json({ 
      message: 'Verifique o seu email para confirmar a criação da conta.' 
    });

  } catch (error) {
    console.error('Erro no registo:', error);
    res.status(500).json({ message: 'Erro no registo' });
  }

  console.log("Resend key:", process.env.RESEND_API_KEY)
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

    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?verified=success`);

    
  } catch (error) {
    console.error('Erro na verificação:', error);
    res.status(500).send('Erro na verificação');
  }
});

// Reenviar email de verificação
app.post('/resend-verification', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email é obrigatório' });
  }

  try {
    // Buscar conta por email
    const userQuery = await pool.query(
      `SELECT ua.id, ua.is_verified, ua.verify_token, ua.verify_token_expires, u.name
       FROM user_auth ua
       JOIN users u ON ua.user_id = u.id
       WHERE ua.email = $1`,
      [email]
    );

    if (userQuery.rows.length === 0) {
      return res.status(200).json({ 
        message: 'Se a conta existir, um email de verificação será enviado.' 
      });
    }

    const user = userQuery.rows[0];

    // Se já está verificado, não precisa verificar novamente
    if (user.is_verified) {
      return res.status(400).json({ 
        message: 'Esta conta já está verificada. Faça login normalmente.' 
      });
    }

    // Gerar novo token
    const token = uuidv4();
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
    const verifyUrl = `${process.env.SERVER_URL || 'http://localhost:3000'}/verify/${token}`;

    // Atualizar token na base de dados
    await pool.query(
      `UPDATE user_auth 
       SET verify_token = $1, verify_token_expires = $2 
       WHERE id = $3`,
      [token, tokenExpiry, user.id]
    );

    // Enviar email de verificação
    const resendResponse = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: 'Confirme o seu email - Compustore',
      html: `
        <h2>Olá, ${user.name}!</h2>
        <p>Recebeu este email porque solicitou um novo link de verificação.</p>
        <p>Para ativar a sua conta, clique no link abaixo:</p>
        <a href="${verifyUrl}">${verifyUrl}</a>
        <p>Este link é válido por 24 horas.</p>
        <p>Se não solicitou isto, pode ignorar este email.</p>
      `,
    });

    console.log("Email de verificação reenviado:", resendResponse);

    res.status(200).json({ 
      message: 'Email de verificação reenviado com sucesso. Verifique a sua caixa de correio.' 
    });

  } catch (error) {
    console.error('Erro ao reenviar email:', error);
    res.status(500).json({ message: 'Erro ao reenviar email de verificação' });
  }
});




app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      `SELECT ua.*, u.role, u.name 
      FROM user_auth ua 
      JOIN users u ON ua.user_id = u.id 
      WHERE ua.email = $1`,
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
     const token = jwt.sign(
      { id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // token válido por 7 dias
    );
    res.json({ message: 'Login bem-sucedido', token, name: user.name, role: user.role });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).send('Erro no login');
  }
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1]; // "Bearer token ex: Bearer abcdef123456..."

  if (!token) return res.status(401).json({ message: "Precisa estar logado" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Token inválido ou expirado" });
    req.user = user; 
    next();
  });
}

app.post("/cart", authenticateToken, async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  // Verifica se o item já existe no carrinho
  const existing = await pool.query(
    "SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2",
    [userId, productId]
  );

  if (existing.rows.length) {
    await pool.query(
      "UPDATE cart_items SET quantity = quantity + $1 WHERE user_id = $2 AND product_id = $3",
      [quantity, userId, productId]
    );
  } else {
    await pool.query(
      "INSERT INTO cart_items(user_id, product_id, quantity) VALUES($1, $2, $3)",
      [userId, productId, quantity]
    );
  }

  res.sendStatus(200);
});

app.get("/getcart", authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT ci.id, ci.product_id, ci.quantity, 
              p.name, p.price, p.image_url, p.category_id
      FROM cart_items ci
      JOIN product p ON ci.product_id = p.id
      WHERE ci.user_id = $1`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar carrinho:", error);
    res.status(500).json({ message: "Erro ao buscar carrinho" });
  }
});

app.post('/getItems', async (req, res) => {
  const { ids } = req.body; // array de ids

  if (!ids || ids.length === 0) {
    return res.json([]);
  }

  try {
    const result = await pool.query(
      'SELECT * FROM product WHERE id = ANY($1::int[])',
      [ids]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao buscar produtos' });
  }
});

// Merge
app.post("/cart/merge", authenticateToken, async (req, res) => {
  const { items } = req.body;
  const userId = req.user.id;

  for (let item of items) {
    const existing = await pool.query(
      "SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2",
      [userId, item.productId]
    );

    if (existing.rows.length) {
      await pool.query(
        "UPDATE cart_items SET quantity = quantity + $1 WHERE user_id = $2 AND product_id = $3",
        [item.quantity, userId, item.productId]
      );
    } else {
      await pool.query(
        "INSERT INTO cart_items(user_id, product_id, quantity) VALUES($1, $2, $3)",
        [userId, item.productId, item.quantity]
      );
    }
  }

  res.sendStatus(200);
});
app.delete("/cart/:itemId", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { itemId } = req.params;

  try {
    await pool.query(
      "DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2",
      [userId, itemId]
    );
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao remover item do carrinho" });
  }
});
app.delete("/cart", authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    await pool.query(
      "DELETE FROM cart_items WHERE user_id = $1",
      [userId]
    );
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao remover item do carrinho" });
  }
});

app.post('/order', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { address, totalPrice, receiver_name, items } = req.body;

  try {
    await pool.query('BEGIN');

    // Inserir a order principal
    const orderResult = await pool.query(
      `INSERT INTO orders (user_id, address, receiver_name, total_price)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [userId, address, receiver_name, totalPrice]
    );

    const orderId = orderResult.rows[0].id;

    // Inserir todos os produtos dessa order
    const insertItemQuery = `
      INSERT INTO order_items (order_id, product_id, quantity, unit_price)
      VALUES ($1, $2, $3, $4)
    `;

    for (const item of items) {
      const { product_id, quantity, price } = item;
      await pool.query(insertItemQuery, [orderId, product_id, quantity, price]);
    }

    await pool.query('COMMIT');// se as 2 queries correrem bem faz commit na base de dados
    res.status(201).json({ message: 'Compra finalizada com sucesso!', orderId });
    
  } catch (err) {
    await pool.query('ROLLBACK');// se houver algum erro faz rollback
    console.error('Erro ao inserir pedido:', err);
    res.status(500).json({ error: 'Erro ao criar pedido.' });
  }
});

app.get('/orders', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await pool.query(
      `SELECT
        o.id,
        o.address,
        o.receiver_name,
        o.total_price,
        o.created_at,
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', p.id,
            'name', p.name,
            'category_id', p.category_id,
            'image_url', p.image_url,
            'price', oi.unit_price,
            'quantity', oi.quantity
          )
        ) AS produtos
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       JOIN product p ON oi.product_id = p.id
       WHERE o.user_id = $1
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao buscar pedidos' });
  }
})



app.listen(PORT, () => {
  console.log(`Servidor a correr na porta ${PORT}`);
});
