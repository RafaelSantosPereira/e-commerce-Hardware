const pool = require('../../config/db');

// Adiciona um produto ou incrementa a quantidade existente.
async function add(userId, productId, quantity) {
  const existing = await pool.query(
    'SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2',
    [userId, productId]
  );

  if (existing.rows.length) {
    await pool.query(
      'UPDATE cart_items SET quantity = quantity + $1 WHERE user_id = $2 AND product_id = $3',
      [quantity, userId, productId]
    );
  } else {
    await pool.query(
      'INSERT INTO cart_items(user_id, product_id, quantity) VALUES($1, $2, $3)',
      [userId, productId, quantity]
    );
  }
}

// Devolve o carrinho com os dados dos produtos.
async function get(userId) {
  const result = await pool.query(`
    SELECT ci.id, ci.product_id, ci.quantity,
           p.name, p.price, p.image_url, p.category_id
    FROM cart_items ci
    JOIN product p ON ci.product_id = p.id
    WHERE ci.user_id = $1
  `, [userId]);

  return result.rows;
}

// Obtém os dados dos produtos de um carrinho local.
async function getItems(ids) {
  if (!ids || ids.length === 0) {
    return [];
  }

  const result = await pool.query('SELECT * FROM product WHERE id = ANY($1::int[])', [ids]);
  return result.rows;
}

// Junta os produtos do carrinho local com o carrinho autenticado.
async function merge(userId, items) {
  for (const item of items) {
    await add(userId, item.productId, item.quantity);
  }
}

// Remove um produto do carrinho do utilizador.
async function remove(userId, productId) {
  await pool.query(
    'DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2',
    [userId, productId]
  );
}

// Remove todos os produtos do carrinho.
async function clear(userId) {
  await pool.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);
}

module.exports = { add, get, getItems, merge, remove, clear };
