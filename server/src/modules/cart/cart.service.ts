const pool = require('../../config/db');
import type { CartItemInput, CartProduct } from '../../model/cart';

const cartService = {
  // Adiciona um produto ou incrementa a quantidade existente.
  async add(userId: number, productId: number, quantity: number): Promise<void> {
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
  },

  // Devolve o carrinho com os dados dos produtos.
  async get(userId: number): Promise<CartProduct[]> {
    const result = await pool.query(`
      SELECT ci.id, ci.product_id, ci.quantity,
            p.name, p.price, p.image_url, p.category_id
      FROM cart_items ci
      JOIN product p ON ci.product_id = p.id
      WHERE ci.user_id = $1
    `, [userId]);

    return result.rows;
  },

  // Obtém os dados dos produtos de um carrinho local.
  async getItems(ids: number[]): Promise<CartProduct[]> {
    if (!ids || ids.length === 0) {
      return [];
    }

    const result = await pool.query('SELECT * FROM product WHERE id = ANY($1::int[])', [ids]);
    return result.rows;
  },

  // Junta os produtos do carrinho local com o carrinho autenticado.
  async merge(userId: number, items: CartItemInput[]): Promise<void> {
    for (const item of items) {
      await cartService.add(userId, item.productId, item.quantity);
    }
  },

    // Remove um produto do carrinho do utilizador.
  async remove(userId: number, productId: number): Promise<void> {
    await pool.query(
      'DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2',
      [userId, productId]
    );
  },

  // Remove todos os produtos do carrinho.
  async clear(userId: number): Promise<void> {
    await pool.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);
  },
};

module.exports = cartService;
