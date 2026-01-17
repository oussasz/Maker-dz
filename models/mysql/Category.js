import { getConnection } from '../../config/database.js';

export const Category = {
  // Find all categories
  async findAll(options = {}) {
    const pool = await getConnection();
    const { activeOnly = false } = options;
    
    let query = 'SELECT * FROM categories';
    if (activeOnly) {
      query += ' WHERE is_active = TRUE';
    }
    query += ' ORDER BY name ASC';
    
    const [rows] = await pool.query(query);
    return rows;
  },

  // Find by ID
  async findById(id) {
    const pool = await getConnection();
    const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
    return rows[0] || null;
  },

  // Find by slug
  async findBySlug(slug) {
    const pool = await getConnection();
    const [rows] = await pool.query('SELECT * FROM categories WHERE slug = ?', [slug]);
    return rows[0] || null;
  },

  // Find by name
  async findByName(name) {
    const pool = await getConnection();
    const [rows] = await pool.query('SELECT * FROM categories WHERE name = ?', [name]);
    return rows[0] || null;
  },

  // Create category
  async create(data) {
    const pool = await getConnection();
    
    const [result] = await pool.query(
      `INSERT INTO categories (name, arabic_name, french_name, slug, description, parent_category_id, image, is_active) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.name,
        data.arabicName || null,
        data.frenchName || null,
        data.slug,
        data.description || null,
        data.parentCategory || null,
        data.image || null,
        data.isActive !== false
      ]
    );

    return { id: result.insertId, ...data };
  },

  // Update category
  async updateById(id, updateData) {
    const pool = await getConnection();
    
    const fields = [];
    const values = [];

    if (updateData.name) { fields.push('name = ?'); values.push(updateData.name); }
    if (updateData.arabicName !== undefined) { fields.push('arabic_name = ?'); values.push(updateData.arabicName); }
    if (updateData.frenchName !== undefined) { fields.push('french_name = ?'); values.push(updateData.frenchName); }
    if (updateData.slug) { fields.push('slug = ?'); values.push(updateData.slug); }
    if (updateData.description !== undefined) { fields.push('description = ?'); values.push(updateData.description); }
    if (updateData.parentCategory !== undefined) { fields.push('parent_category_id = ?'); values.push(updateData.parentCategory); }
    if (updateData.image !== undefined) { fields.push('image = ?'); values.push(updateData.image); }
    if (updateData.isActive !== undefined) { fields.push('is_active = ?'); values.push(updateData.isActive); }

    if (fields.length === 0) return null;

    values.push(id);
    await pool.query(`UPDATE categories SET ${fields.join(', ')} WHERE id = ?`, values);
    
    return this.findById(id);
  },

  // Delete category
  async deleteById(id) {
    const pool = await getConnection();
    const [result] = await pool.query('DELETE FROM categories WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  // Get subcategories
  async getSubcategories(parentId) {
    const pool = await getConnection();
    const [rows] = await pool.query(
      'SELECT * FROM categories WHERE parent_category_id = ? ORDER BY name ASC',
      [parentId]
    );
    return rows;
  },

  // Get root categories (no parent)
  async getRootCategories() {
    const pool = await getConnection();
    const [rows] = await pool.query(
      'SELECT * FROM categories WHERE parent_category_id IS NULL ORDER BY name ASC'
    );
    return rows;
  }
};

export default Category;
