import { getConnection } from '../../config/database.js';

export const Order = {
  // Find all orders for a user
  async findByUserId(userId, options = {}) {
    const pool = await getConnection();
    const { limit = 20, offset = 0, status } = options;
    
    let query = 'SELECT * FROM orders WHERE user_id = ?';
    const values = [userId];
    
    if (status) {
      query += ' AND order_status = ?';
      values.push(status);
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);
    
    const [rows] = await pool.query(query, values);
    
    // Get items for each order
    for (const order of rows) {
      order.items = await this.getOrderItems(order.id);
      order.shippingAddress = typeof order.shipping_address === 'string' 
        ? JSON.parse(order.shipping_address) 
        : order.shipping_address;
    }
    
    return rows;
  },

  // Find order by ID
  async findById(id) {
    const pool = await getConnection();
    const [rows] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
    
    if (!rows[0]) return null;
    
    const order = rows[0];
    order.items = await this.getOrderItems(id);
    order.shippingAddress = typeof order.shipping_address === 'string' 
      ? JSON.parse(order.shipping_address) 
      : order.shipping_address;
    
    return order;
  },

  // Get order items
  async getOrderItems(orderId) {
    const pool = await getConnection();
    const [rows] = await pool.query(
      `SELECT oi.*, p.slug as product_slug, p.main_images as product_images
       FROM order_items oi
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [orderId]
    );
    return rows.map(item => ({
      ...item,
      productImages: typeof item.product_images === 'string' ? JSON.parse(item.product_images) : item.product_images
    }));
  },

  // Find orders by seller
  async findBySellerId(sellerId, options = {}) {
    const pool = await getConnection();
    const { limit = 20, offset = 0, status } = options;
    
    let query = `
      SELECT DISTINCT o.* FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      WHERE oi.seller_id = ?
    `;
    const values = [sellerId];
    
    if (status) {
      query += ' AND o.order_status = ?';
      values.push(status);
    }
    
    query += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);
    
    const [rows] = await pool.query(query, values);
    
    for (const order of rows) {
      order.items = await this.getOrderItems(order.id);
      order.shippingAddress = typeof order.shipping_address === 'string' 
        ? JSON.parse(order.shipping_address) 
        : order.shipping_address;
    }
    
    return rows;
  },

  // Create order
  async create(data) {
    const pool = await getConnection();
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      // Insert order
      const [result] = await connection.query(
        `INSERT INTO orders (user_id, shipping_address, order_status, subtotal, total, notes) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          data.userId,
          JSON.stringify(data.shippingAddress),
          data.orderStatus || 'pending',
          data.subtotal,
          data.total,
          data.notes || null
        ]
      );

      const orderId = result.insertId;

      // Insert order items
      if (data.items && data.items.length > 0) {
        for (const item of data.items) {
          await connection.query(
            `INSERT INTO order_items (order_id, product_id, seller_id, variant_id, personalization, name, quantity, price, subtotal)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              orderId,
              item.productId,
              item.sellerId,
              item.variantId,
              item.personalization || null,
              item.name,
              item.quantity,
              item.price,
              item.subtotal
            ]
          );
        }
      }

      await connection.commit();
      return this.findById(orderId);

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // Update order status
  async updateStatus(id, status) {
    const pool = await getConnection();
    
    const updates = { order_status: status };
    if (status === 'cancelled') {
      updates.cancelled_at = new Date();
    } else if (status === 'delivered') {
      updates.delivered_at = new Date();
    }
    
    const fields = Object.keys(updates).map(k => `${k} = ?`).join(', ');
    const values = [...Object.values(updates), id];
    
    await pool.query(`UPDATE orders SET ${fields} WHERE id = ?`, values);
    return this.findById(id);
  },

  // Delete order
  async deleteById(id) {
    const pool = await getConnection();
    const [result] = await pool.query('DELETE FROM orders WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  // Count orders
  async countByUserId(userId) {
    const pool = await getConnection();
    const [rows] = await pool.query('SELECT COUNT(*) as total FROM orders WHERE user_id = ?', [userId]);
    return rows[0].total;
  }
};

export default Order;
