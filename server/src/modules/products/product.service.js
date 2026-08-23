const pool = require('../../config/db');

// Obtém todos os produtos do catálogo.
async function getAll() {
  const result = await pool.query('SELECT * FROM product');
  return result.rows;
}

// Obtém os produtos pertencentes a uma categoria.
async function getByCategory(categoryId) {
  const result = await pool.query('SELECT * FROM product WHERE category_id = $1', [categoryId]);
  return result.rows;
}

// Obtém os dados principais e as especificações de um produto.
async function getDetails(id) {
  const productResult = await pool.query(
    'SELECT id, name, price, image_url FROM product WHERE id = $1',
    [id]
  );

  if (productResult.rows.length === 0) {
    return null;
  }

  const specsResult = await pool.query(
    'SELECT spec_key, spec_value FROM product_specs WHERE product_id = $1',
    [id]
  );

  return { product: productResult.rows[0], specs: specsResult.rows };
}

// Pesquisa produtos pelo nome.
async function search(searchQuery) {
  const result = await pool.query(
    'SELECT * FROM product WHERE name ILIKE $1',
    [`%${searchQuery}%`]
  );
  return result.rows;
}

module.exports = { getAll, getByCategory, getDetails, search };
