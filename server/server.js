const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
const PORT = 3000;

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.get('/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM product');
    res.json(result.rows);
  } catch (error) {
    console.error('Erro na query:', error);
    res.status(500).send('Erro ao buscar produtos');
  }
});

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

app.listen(PORT, () => {
  console.log(`Servidor a correr na porta ${PORT}`);
});
