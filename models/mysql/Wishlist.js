import { getConnection } from "../../config/database.js";

export const Wishlist = {
  // Find wishlist by user ID
  async findByUserId(userId) {
    const pool = await getConnection();
    const [rows] = await pool.query(
      "SELECT * FROM wishlists WHERE user_id = ?",
      [userId],
    );

    if (!rows[0]) return null;

    const wishlist = rows[0];
    wishlist.products = await this.getWishlistProducts(wishlist.id);

    return wishlist;
  },

  // Get wishlist products with details
  async getWishlistProducts(wishlistId) {
    const pool = await getConnection();
    const [rows] = await pool.query(
      `SELECT wi.*, 
              p.name, 
              p.slug,
              p.description,
              p.base_price,
              p.main_images,
              p.average_rating,
              p.seller_id
       FROM wishlist_items wi
       LEFT JOIN products p ON wi.product_id = p.id
       WHERE wi.wishlist_id = ?
       ORDER BY wi.added_at DESC`,
      [wishlistId],
    );

    return rows.map((item) => ({
      productId: item.product_id,
      addedAt: item.added_at,
      product: {
        id: item.product_id,
        name: item.name,
        slug: item.slug,
        description: item.description,
        basePrice: parseFloat(item.base_price),
        mainImages:
          typeof item.main_images === "string"
            ? JSON.parse(item.main_images)
            : item.main_images,
        averageRating: parseFloat(item.average_rating),
        sellerId: item.seller_id,
      },
    }));
  },

  // Create or get wishlist
  async getOrCreate(userId) {
    const pool = await getConnection();

    let wishlist = await this.findByUserId(userId);
    if (wishlist) return wishlist;

    const [result] = await pool.query(
      "INSERT INTO wishlists (user_id) VALUES (?)",
      [userId],
    );

    return { id: result.insertId, user_id: userId, products: [] };
  },

  // Add product to wishlist
  async addProduct(userId, productId) {
    const pool = await getConnection();

    const wishlist = await this.getOrCreate(userId);

    // Check if already exists
    const [existing] = await pool.query(
      "SELECT * FROM wishlist_items WHERE wishlist_id = ? AND product_id = ?",
      [wishlist.id, productId],
    );

    if (existing.length > 0) {
      return this.findByUserId(userId); // Already in wishlist
    }

    await pool.query(
      "INSERT INTO wishlist_items (wishlist_id, product_id) VALUES (?, ?)",
      [wishlist.id, productId],
    );

    return this.findByUserId(userId);
  },

  // Remove product from wishlist
  async removeProduct(userId, productId) {
    const pool = await getConnection();

    const wishlist = await this.findByUserId(userId);
    if (!wishlist) return null;

    await pool.query(
      "DELETE FROM wishlist_items WHERE wishlist_id = ? AND product_id = ?",
      [wishlist.id, productId],
    );

    return this.findByUserId(userId);
  },

  // Check if product is in wishlist
  async hasProduct(userId, productId) {
    const pool = await getConnection();

    const wishlist = await this.findByUserId(userId);
    if (!wishlist) return false;

    const [rows] = await pool.query(
      "SELECT 1 FROM wishlist_items WHERE wishlist_id = ? AND product_id = ?",
      [wishlist.id, productId],
    );

    return rows.length > 0;
  },

  // Clear wishlist
  async clear(userId) {
    const pool = await getConnection();

    const wishlist = await this.findByUserId(userId);
    if (!wishlist) return null;

    await pool.query("DELETE FROM wishlist_items WHERE wishlist_id = ?", [
      wishlist.id,
    ]);

    return { ...wishlist, products: [] };
  },
};

export default Wishlist;
