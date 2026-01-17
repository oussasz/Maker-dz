import { getConnection } from '../../config/database.js';

export const SellerProfile = {
  // Find by user ID
  async findByUserId(userId) {
    const pool = await getConnection();
    const [rows] = await pool.query(
      `SELECT sp.*, u.username, u.email, u.first_name, u.last_name
       FROM seller_profiles sp
       LEFT JOIN users u ON sp.user_id = u.id
       WHERE sp.user_id = ?`,
      [userId]
    );
    return rows[0] || null;
  },

  // Find by ID
  async findById(id) {
    const pool = await getConnection();
    const [rows] = await pool.query(
      `SELECT sp.*, u.username, u.email
       FROM seller_profiles sp
       LEFT JOIN users u ON sp.user_id = u.id
       WHERE sp.id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  // Find by shop name
  async findByShopName(shopName) {
    const pool = await getConnection();
    const [rows] = await pool.query('SELECT * FROM seller_profiles WHERE shop_name = ?', [shopName]);
    return rows[0] || null;
  },

  // Create seller profile
  async create(data) {
    const pool = await getConnection();
    
    const [result] = await pool.query(
      `INSERT INTO seller_profiles (user_id, shop_name, shop_description, shop_logo, shop_banner, is_verified)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        data.userId,
        data.shopName,
        data.shopDescription || null,
        data.shopLogo || null,
        data.shopBanner || null,
        data.isVerified || false
      ]
    );
    
    // Update user role to seller
    await pool.query('UPDATE users SET role = ? WHERE id = ?', ['seller', data.userId]);
    
    return this.findById(result.insertId);
  },

  // Update seller profile
  async updateByUserId(userId, updateData) {
    const pool = await getConnection();
    
    const fields = [];
    const values = [];

    if (updateData.shopName) { fields.push('shop_name = ?'); values.push(updateData.shopName); }
    if (updateData.shopDescription !== undefined) { fields.push('shop_description = ?'); values.push(updateData.shopDescription); }
    if (updateData.shopLogo !== undefined) { fields.push('shop_logo = ?'); values.push(updateData.shopLogo); }
    if (updateData.shopBanner !== undefined) { fields.push('shop_banner = ?'); values.push(updateData.shopBanner); }
    if (updateData.isVerified !== undefined) { fields.push('is_verified = ?'); values.push(updateData.isVerified); }

    if (fields.length === 0) return this.findByUserId(userId);

    values.push(userId);
    await pool.query(`UPDATE seller_profiles SET ${fields.join(', ')} WHERE user_id = ?`, values);
    
    return this.findByUserId(userId);
  },

  // Update stats
  async updateStats(userId) {
    const pool = await getConnection();
    
    // Calculate total sales
    const [sales] = await pool.query(
      `SELECT COUNT(DISTINCT o.id) as total_sales
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       WHERE oi.seller_id = ? AND o.order_status = 'delivered'`,
      [userId]
    );
    
    // Calculate average rating from product reviews
    const [ratings] = await pool.query(
      `SELECT AVG(r.rating) as avg_rating, COUNT(r.id) as total_reviews
       FROM reviews r
       JOIN products p ON r.product_id = p.id
       WHERE p.seller_id = ?`,
      [userId]
    );
    
    await pool.query(
      `UPDATE seller_profiles SET 
        total_sales = ?,
        average_rating = ?,
        total_reviews = ?
       WHERE user_id = ?`,
      [
        sales[0].total_sales || 0,
        ratings[0].avg_rating || 0,
        ratings[0].total_reviews || 0,
        userId
      ]
    );
    
    return this.findByUserId(userId);
  },

  // Delete seller profile
  async deleteByUserId(userId) {
    const pool = await getConnection();
    const [result] = await pool.query('DELETE FROM seller_profiles WHERE user_id = ?', [userId]);
    
    if (result.affectedRows > 0) {
      await pool.query('UPDATE users SET role = ? WHERE id = ?', ['customer', userId]);
    }
    
    return result.affectedRows > 0;
  },

  // Get all sellers
  async findAll(options = {}) {
    const pool = await getConnection();
    const { limit = 20, offset = 0, verified } = options;
    
    let query = `
      SELECT sp.*, u.username, u.email
      FROM seller_profiles sp
      LEFT JOIN users u ON sp.user_id = u.id
      WHERE 1=1
    `;
    const values = [];
    
    if (verified !== undefined) {
      query += ' AND sp.is_verified = ?';
      values.push(verified);
    }
    
    query += ' ORDER BY sp.created_at DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);
    
    const [rows] = await pool.query(query, values);
    return rows;
  }
};

export default SellerProfile;
