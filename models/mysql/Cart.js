import { getConnection } from '../../config/database.js';

export const Cart = {
  // Find cart by user ID
  async findByUserId(userId) {
    const pool = await getConnection();
    const [rows] = await pool.query('SELECT * FROM carts WHERE user_id = ?', [userId]);
    
    if (!rows[0]) return null;
    
    const cart = rows[0];
    cart.items = await this.getCartItems(cart.id);
    
    return cart;
  },

  // Get cart items with product details
  async getCartItems(cartId) {
    const pool = await getConnection();
    const [rows] = await pool.query(
      `SELECT ci.*, 
              p.name as product_name, 
              p.slug as product_slug,
              p.main_images as product_images,
              p.seller_id,
              pv.attributes as variant_attributes,
              pv.images as variant_images
       FROM cart_items ci
       LEFT JOIN products p ON ci.product_id = p.id
       LEFT JOIN product_variants pv ON ci.variant_id = pv.id
       WHERE ci.cart_id = ?`,
      [cartId]
    );
    
    return rows.map(item => ({
      id: item.id,
      productId: item.product_id,
      variantId: item.variant_id,
      personalization: item.personalization,
      quantity: item.quantity,
      price: parseFloat(item.price),
      product: {
        id: item.product_id,
        name: item.product_name,
        slug: item.product_slug,
        mainImages: typeof item.product_images === 'string' ? JSON.parse(item.product_images) : item.product_images,
        sellerId: item.seller_id
      },
      variant: {
        id: item.variant_id,
        attributes: typeof item.variant_attributes === 'string' ? JSON.parse(item.variant_attributes) : item.variant_attributes,
        images: typeof item.variant_images === 'string' ? JSON.parse(item.variant_images) : item.variant_images
      }
    }));
  },

  // Create or get cart
  async getOrCreate(userId) {
    const pool = await getConnection();
    
    let cart = await this.findByUserId(userId);
    if (cart) return cart;
    
    const [result] = await pool.query(
      'INSERT INTO carts (user_id, total_amount) VALUES (?, 0)',
      [userId]
    );
    
    return { id: result.insertId, user_id: userId, total_amount: 0, items: [] };
  },

  // Add item to cart
  async addItem(userId, itemData) {
    const pool = await getConnection();
    
    const cart = await this.getOrCreate(userId);
    
    // Check if item already exists
    const [existing] = await pool.query(
      'SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ? AND variant_id = ?',
      [cart.id, itemData.productId, itemData.variantId]
    );
    
    if (existing.length > 0) {
      // Update quantity
      await pool.query(
        'UPDATE cart_items SET quantity = quantity + ? WHERE id = ?',
        [itemData.quantity || 1, existing[0].id]
      );
    } else {
      // Insert new item
      await pool.query(
        'INSERT INTO cart_items (cart_id, product_id, variant_id, personalization, quantity, price) VALUES (?, ?, ?, ?, ?, ?)',
        [cart.id, itemData.productId, itemData.variantId, itemData.personalization || null, itemData.quantity || 1, itemData.price]
      );
    }
    
    // Update total
    await this.updateTotal(cart.id);
    
    return this.findByUserId(userId);
  },

  // Update item quantity
  async updateItemQuantity(userId, itemId, quantity) {
    const pool = await getConnection();
    
    const cart = await this.findByUserId(userId);
    if (!cart) return null;
    
    if (quantity <= 0) {
      await pool.query('DELETE FROM cart_items WHERE id = ? AND cart_id = ?', [itemId, cart.id]);
    } else {
      await pool.query('UPDATE cart_items SET quantity = ? WHERE id = ? AND cart_id = ?', [quantity, itemId, cart.id]);
    }
    
    await this.updateTotal(cart.id);
    
    return this.findByUserId(userId);
  },

  // Remove item from cart
  async removeItem(userId, itemId) {
    const pool = await getConnection();
    
    const cart = await this.findByUserId(userId);
    if (!cart) return null;
    
    await pool.query('DELETE FROM cart_items WHERE id = ? AND cart_id = ?', [itemId, cart.id]);
    await this.updateTotal(cart.id);
    
    return this.findByUserId(userId);
  },

  // Clear cart
  async clear(userId) {
    const pool = await getConnection();
    
    const cart = await this.findByUserId(userId);
    if (!cart) return null;
    
    await pool.query('DELETE FROM cart_items WHERE cart_id = ?', [cart.id]);
    await pool.query('UPDATE carts SET total_amount = 0 WHERE id = ?', [cart.id]);
    
    return { ...cart, items: [], total_amount: 0 };
  },

  // Update total amount
  async updateTotal(cartId) {
    const pool = await getConnection();
    
    const [rows] = await pool.query(
      'SELECT SUM(price * quantity) as total FROM cart_items WHERE cart_id = ?',
      [cartId]
    );
    
    const total = rows[0].total || 0;
    await pool.query('UPDATE carts SET total_amount = ? WHERE id = ?', [total, cartId]);
    
    return total;
  }
};

export default Cart;
