const pool = require('../../config/db');
import type { CreateOrderData, Order } from '../../model/orders';

const orderService = {
  // Cria uma encomenda e os seus itens numa única transação.
  async create(userId: number, { address, totalPrice, receiver_name, items }: CreateOrderData): Promise<number> {
    const totalIsValid = Number.isFinite(Number(totalPrice));
    if (!address || !receiver_name || !totalIsValid || !Array.isArray(items) || items.length === 0) {
      throw Object.assign(new Error('Dados da encomenda inválidos.'), { status: 400 });
    }

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const orderResult = await client.query(
        `
          INSERT INTO orders (user_id, address, receiver_name, total_price)
          VALUES ($1, $2, $3, $4)
          RETURNING id
        `,
        [userId, address, receiver_name, totalPrice]
      );

      const orderId = orderResult.rows[0].id;

      for (const item of items) {
        await client.query(
          `
            INSERT INTO order_items (order_id, product_id, quantity, unit_price)
            VALUES ($1, $2, $3, $4)
          `,
          [orderId, item.product_id, item.quantity, item.price]
        );
      }
      await client.query('COMMIT');
      return orderId;
    } catch (error) {
      await client.query('ROLLBACK').catch(rollbackError => {
        console.error('Erro ao fazer rollback:', rollbackError);
      });
      throw error;
    } finally {
      client.release();
    }
  },

  // Lista as encomendas do utilizador com os respetivos produtos.
  async getByUser(userId: number): Promise<Order[]> {
    const result = await pool.query(`
      SELECT
        o.id,
        o.address,
        o.receiver_name,
        o.total_price,
        o.created_at,
        JSON_AGG(JSON_BUILD_OBJECT(
          'id', p.id,
          'name', p.name,
          'category_id', p.category_id,
          'image_url', p.image_url,
          'price', oi.unit_price,
          'quantity', oi.quantity
        )) AS produtos
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN product p ON oi.product_id = p.id
      WHERE o.user_id = $1
      GROUP BY o.id
      ORDER BY o.created_at DESC`, [userId]);

    console.log(result.rows)
    return result.rows;
  },
};

module.exports = orderService;
