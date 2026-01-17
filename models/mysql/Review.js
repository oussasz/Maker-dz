import { getConnection } from "../../config/database.js";

export const Review = {
  // Find reviews by product ID
  async findByProductId(productId, options = {}) {
    const pool = await getConnection();
    const { limit = 20, offset = 0 } = options;

    const [rows] = await pool.query(
      `SELECT r.*, u.username, u.first_name, u.avatar
       FROM reviews r
       LEFT JOIN users u ON r.user_id = u.id
       WHERE r.product_id = ?
       ORDER BY r.created_at DESC
       LIMIT ? OFFSET ?`,
      [productId, limit, offset],
    );

    return rows.map((row) => ({
      ...row,
      images:
        typeof row.images === "string" ? JSON.parse(row.images) : row.images,
      user: {
        id: row.user_id,
        username: row.username,
        firstName: row.first_name,
        avatar: row.avatar,
      },
    }));
  },

  // Find review by ID
  async findById(id) {
    const pool = await getConnection();
    const [rows] = await pool.query("SELECT * FROM reviews WHERE id = ?", [id]);
    if (!rows[0]) return null;

    rows[0].images =
      typeof rows[0].images === "string"
        ? JSON.parse(rows[0].images)
        : rows[0].images;
    return rows[0];
  },

  // Find review by user and product
  async findByUserAndProduct(userId, productId) {
    const pool = await getConnection();
    const [rows] = await pool.query(
      "SELECT * FROM reviews WHERE user_id = ? AND product_id = ?",
      [userId, productId],
    );

    if (!rows[0]) return null;
    rows[0].images =
      typeof rows[0].images === "string"
        ? JSON.parse(rows[0].images)
        : rows[0].images;
    return rows[0];
  },

  // Create review
  async create(data) {
    const pool = await getConnection();

    const [result] = await pool.query(
      `INSERT INTO reviews (product_id, user_id, order_id, rating, title, comment, images, is_verified_purchase)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.productId,
        data.userId,
        data.orderId || null,
        data.rating,
        data.title || null,
        data.comment || null,
        JSON.stringify(data.images || []),
        data.isVerifiedPurchase || false,
      ],
    );

    // Update product average rating
    await this.updateProductRating(data.productId);

    return this.findById(result.insertId);
  },

  // Update review
  async updateById(id, updateData) {
    const pool = await getConnection();

    const fields = [];
    const values = [];

    if (updateData.rating) {
      fields.push("rating = ?");
      values.push(updateData.rating);
    }
    if (updateData.title !== undefined) {
      fields.push("title = ?");
      values.push(updateData.title);
    }
    if (updateData.comment !== undefined) {
      fields.push("comment = ?");
      values.push(updateData.comment);
    }
    if (updateData.images) {
      fields.push("images = ?");
      values.push(JSON.stringify(updateData.images));
    }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    await pool.query(
      `UPDATE reviews SET ${fields.join(", ")} WHERE id = ?`,
      values,
    );

    // Get review to update product rating
    const review = await this.findById(id);
    if (review) {
      await this.updateProductRating(review.product_id);
    }

    return review;
  },

  // Delete review
  async deleteById(id) {
    const pool = await getConnection();

    const review = await this.findById(id);
    if (!review) return false;

    const [result] = await pool.query("DELETE FROM reviews WHERE id = ?", [id]);

    if (result.affectedRows > 0) {
      await this.updateProductRating(review.product_id);
    }

    return result.affectedRows > 0;
  },

  // Update product average rating
  async updateProductRating(productId) {
    const pool = await getConnection();

    const [stats] = await pool.query(
      "SELECT AVG(rating) as avg_rating, COUNT(*) as total FROM reviews WHERE product_id = ?",
      [productId],
    );

    await pool.query(
      "UPDATE products SET average_rating = ?, total_reviews = ? WHERE id = ?",
      [stats[0].avg_rating || 0, stats[0].total, productId],
    );
  },

  // Increment helpful count
  async incrementHelpful(id) {
    const pool = await getConnection();
    await pool.query(
      "UPDATE reviews SET helpful_count = helpful_count + 1 WHERE id = ?",
      [id],
    );
    return this.findById(id);
  },

  // Get product rating stats
  async getProductStats(productId) {
    const pool = await getConnection();

    const [stats] = await pool.query(
      `SELECT 
        COUNT(*) as total,
        AVG(rating) as average,
        SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_star,
        SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_star,
        SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_star,
        SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_star,
        SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star
       FROM reviews WHERE product_id = ?`,
      [productId],
    );

    return stats[0];
  },
};

export default Review;
