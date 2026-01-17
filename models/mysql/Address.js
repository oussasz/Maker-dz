import { getConnection } from '../../config/database.js';

export const Address = {
  // Find addresses by user ID
  async findByUserId(userId) {
    const pool = await getConnection();
    const [rows] = await pool.query(
      'SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC',
      [userId]
    );
    return rows;
  },

  // Find address by ID
  async findById(id) {
    const pool = await getConnection();
    const [rows] = await pool.query('SELECT * FROM addresses WHERE id = ?', [id]);
    return rows[0] || null;
  },

  // Find default address
  async findDefault(userId) {
    const pool = await getConnection();
    const [rows] = await pool.query(
      'SELECT * FROM addresses WHERE user_id = ? AND is_default = TRUE LIMIT 1',
      [userId]
    );
    return rows[0] || null;
  },

  // Create address
  async create(data) {
    const pool = await getConnection();
    
    // If this is default, unset other defaults
    if (data.is_default) {
      await pool.query('UPDATE addresses SET is_default = FALSE WHERE user_id = ?', [data.user_id]);
    }
    
    const [result] = await pool.query(
      `INSERT INTO addresses (user_id, label, full_name, phone, wilaya, commune, address, is_default)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.user_id,
        data.label || null,
        data.full_name,
        data.phone,
        data.wilaya,
        data.commune,
        data.address,
        data.is_default || false
      ]
    );
    
    return result.insertId;
  },

  // Update address
  async updateById(id, updateData) {
    const pool = await getConnection();
    
    const fields = [];
    const values = [];

    if (updateData.label !== undefined) { fields.push('label = ?'); values.push(updateData.label); }
    if (updateData.full_name) { fields.push('full_name = ?'); values.push(updateData.full_name); }
    if (updateData.phone) { fields.push('phone = ?'); values.push(updateData.phone); }
    if (updateData.wilaya) { fields.push('wilaya = ?'); values.push(updateData.wilaya); }
    if (updateData.commune) { fields.push('commune = ?'); values.push(updateData.commune); }
    if (updateData.address) { fields.push('address = ?'); values.push(updateData.address); }
    if (updateData.is_default !== undefined) { fields.push('is_default = ?'); values.push(updateData.is_default); }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    await pool.query(`UPDATE addresses SET ${fields.join(', ')} WHERE id = ?`, values);
    
    return this.findById(id);
  },

  // Set as default
  async setDefault(userId, addressId) {
    const pool = await getConnection();
    
    await pool.query('UPDATE addresses SET is_default = FALSE WHERE user_id = ?', [userId]);
    await pool.query('UPDATE addresses SET is_default = TRUE WHERE id = ? AND user_id = ?', [addressId, userId]);
    
    return this.findById(addressId);
  },

  // Delete address
  async deleteById(id) {
    const pool = await getConnection();
    const [result] = await pool.query('DELETE FROM addresses WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};

export default Address;
