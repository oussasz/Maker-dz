import { getConnection } from "../../config/database.js";

export const Product = {
  // Find all products with pagination and filters
  async findAll(options = {}) {
    const pool = await getConnection();
    const {
      limit = 20,
      offset = 0,
      sort = "created_at DESC",
      filters = {},
    } = options;

    // Support both direct options and nested filters
    const sellerId = filters.seller_id || options.sellerId;
    const categoryId = filters.category_id || options.categoryId;
    // Only filter by isActive if explicitly set
    const isActive = filters.is_active !== undefined
      ? filters.is_active
      : options.isActive;
    const isFeatured = filters.is_featured;
    const minPrice = filters.min_price;
    const maxPrice = filters.max_price;
    const search = filters.search || options.search;

    console.log("Product.findAll - isActive filter:", isActive);

    let query = `
      SELECT p.*, 
             u.username as seller_username,
             u.first_name as seller_first_name,
             u.last_name as seller_last_name
      FROM products p
      LEFT JOIN users u ON p.seller_id = u.id
      WHERE 1=1
    `;
    let countQuery = "SELECT COUNT(*) as total FROM products p WHERE 1=1";
    const values = [];
    const countValues = [];

    if (isActive !== null && isActive !== undefined) {
      query += " AND p.is_active = ?";
      countQuery += " AND p.is_active = ?";
      values.push(isActive);
      countValues.push(isActive);
    }
    if (sellerId) {
      query += " AND p.seller_id = ?";
      countQuery += " AND p.seller_id = ?";
      values.push(sellerId);
      countValues.push(sellerId);
    }
    if (categoryId) {
      query +=
        " AND p.id IN (SELECT product_id FROM product_categories WHERE category_id = ?)";
      countQuery +=
        " AND p.id IN (SELECT product_id FROM product_categories WHERE category_id = ?)";
      values.push(categoryId);
      countValues.push(categoryId);
    }
    if (isFeatured) {
      query += " AND p.is_featured = TRUE";
      countQuery += " AND p.is_featured = TRUE";
    }
    if (minPrice) {
      query += " AND p.base_price >= ?";
      countQuery += " AND p.base_price >= ?";
      values.push(minPrice);
      countValues.push(minPrice);
    }
    if (maxPrice) {
      query += " AND p.base_price <= ?";
      countQuery += " AND p.base_price <= ?";
      values.push(maxPrice);
      countValues.push(maxPrice);
    }
    if (search) {
      query += " AND (p.name LIKE ? OR p.description LIKE ?)";
      countQuery += " AND (p.name LIKE ? OR p.description LIKE ?)";
      values.push(`%${search}%`, `%${search}%`);
      countValues.push(`%${search}%`, `%${search}%`);
    }

    // Handle sort
    let orderBy = "p.created_at DESC";
    if (sort === "-createdAt" || sort === "created_at DESC") {
      orderBy = "p.created_at DESC";
    } else if (sort === "createdAt" || sort === "created_at ASC") {
      orderBy = "p.created_at ASC";
    } else if (sort === "-basePrice" || sort === "base_price DESC") {
      orderBy = "p.base_price DESC";
    } else if (sort === "basePrice" || sort === "base_price ASC") {
      orderBy = "p.base_price ASC";
    } else if (sort === "-averageRating") {
      orderBy = "p.average_rating DESC";
    }

    query += ` ORDER BY ${orderBy} LIMIT ? OFFSET ?`;
    values.push(limit, offset);

    const [rows] = await pool.query(query, values);
    const [countRows] = await pool.query(countQuery, countValues);

    // Parse JSON fields
    return {
      products: rows.map((row) => this._parseProduct(row)),
      total: countRows[0].total,
    };
  },

  // Find by ID
  async findById(id) {
    const pool = await getConnection();
    const [rows] = await pool.query(
      `SELECT p.*, 
              u.username as seller_username,
              u.first_name as seller_first_name,
              u.last_name as seller_last_name
       FROM products p
       LEFT JOIN users u ON p.seller_id = u.id
       WHERE p.id = ?`,
      [id],
    );

    if (!rows[0]) return null;

    const product = this._parseProduct(rows[0]);

    // Get variants
    product.variants = await this.getVariants(id);

    // Get categories
    product.categories = await this.getCategories(id);

    return product;
  },

  // Find by slug
  async findBySlug(slug) {
    const pool = await getConnection();
    const [rows] = await pool.query(
      `SELECT p.*, 
              u.username as seller_username,
              u.first_name as seller_first_name
       FROM products p
       LEFT JOIN users u ON p.seller_id = u.id
       WHERE p.slug = ?`,
      [slug],
    );

    if (!rows[0]) return null;

    const product = this._parseProduct(rows[0]);
    product.variants = await this.getVariants(rows[0].id);
    product.categories = await this.getCategories(rows[0].id);

    return product;
  },

  // Get product variants
  async getVariants(productId) {
    const pool = await getConnection();
    const [rows] = await pool.query(
      "SELECT * FROM product_variants WHERE product_id = ? ORDER BY variant_index",
      [productId],
    );
    return rows.map((row) => ({
      id: row.id,
      attributes:
        typeof row.attributes === "string"
          ? JSON.parse(row.attributes)
          : row.attributes,
      sku: row.sku,
      price: parseFloat(row.price),
      quantity: row.quantity,
      images:
        typeof row.images === "string" ? JSON.parse(row.images) : row.images,
      index: row.variant_index,
    }));
  },

  // Get product categories
  async getCategories(productId) {
    const pool = await getConnection();
    const [rows] = await pool.query(
      `SELECT c.* FROM categories c
       JOIN product_categories pc ON c.id = pc.category_id
       WHERE pc.product_id = ?`,
      [productId],
    );
    return rows;
  },

  // Create product
  async create(data) {
    const pool = await getConnection();
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Insert product
      const [result] = await connection.query(
        `INSERT INTO products (seller_id, name, slug, description, base_price, variant_options, variant_variables, main_images, specifications, tags, is_active) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.sellerId,
          data.name,
          data.slug,
          data.description,
          data.basePrice,
          JSON.stringify(data.variantOptions || {}),
          JSON.stringify(data.variantVariables || []),
          JSON.stringify(data.mainImages || []),
          JSON.stringify(data.specifications || {}),
          JSON.stringify(data.tags || []),
          data.isActive !== false,
        ],
      );

      const productId = result.insertId;

      // Insert categories
      if (data.categories && data.categories.length > 0) {
        const categoryValues = data.categories.map((catId) => [
          productId,
          catId,
        ]);
        await connection.query(
          "INSERT INTO product_categories (product_id, category_id) VALUES ?",
          [categoryValues],
        );
      }

      // Insert variants
      if (data.variants && data.variants.length > 0) {
        for (let i = 0; i < data.variants.length; i++) {
          const variant = data.variants[i];
          await connection.query(
            `INSERT INTO product_variants (product_id, attributes, sku, price, quantity, images, variant_index)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              productId,
              JSON.stringify(variant.attributes || {}),
              variant.sku || null,
              variant.price,
              variant.quantity || 0,
              JSON.stringify(variant.images || []),
              i,
            ],
          );
        }
      }

      await connection.commit();
      return this.findById(productId);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // Update product
  async updateById(id, updateData) {
    const pool = await getConnection();

    const fields = [];
    const values = [];

    if (updateData.name) {
      fields.push("name = ?");
      values.push(updateData.name);
    }
    if (updateData.slug) {
      fields.push("slug = ?");
      values.push(updateData.slug);
    }
    if (updateData.description) {
      fields.push("description = ?");
      values.push(updateData.description);
    }
    if (updateData.basePrice) {
      fields.push("base_price = ?");
      values.push(updateData.basePrice);
    }
    if (updateData.variantOptions) {
      fields.push("variant_options = ?");
      values.push(JSON.stringify(updateData.variantOptions));
    }
    if (updateData.variantVariables) {
      fields.push("variant_variables = ?");
      values.push(JSON.stringify(updateData.variantVariables));
    }
    if (updateData.mainImages) {
      fields.push("main_images = ?");
      values.push(JSON.stringify(updateData.mainImages));
    }
    if (updateData.specifications) {
      fields.push("specifications = ?");
      values.push(JSON.stringify(updateData.specifications));
    }
    if (updateData.tags) {
      fields.push("tags = ?");
      values.push(JSON.stringify(updateData.tags));
    }
    if (updateData.isActive !== undefined) {
      fields.push("is_active = ?");
      values.push(updateData.isActive);
    }
    if (updateData.averageRating !== undefined) {
      fields.push("average_rating = ?");
      values.push(updateData.averageRating);
    }
    if (updateData.totalReviews !== undefined) {
      fields.push("total_reviews = ?");
      values.push(updateData.totalReviews);
    }
    if (updateData.totalSold !== undefined) {
      fields.push("total_sold = ?");
      values.push(updateData.totalSold);
    }

    if (fields.length > 0) {
      values.push(id);
      await pool.query(
        `UPDATE products SET ${fields.join(", ")} WHERE id = ?`,
        values,
      );
    }

    return this.findById(id);
  },

  // Delete product
  async deleteById(id) {
    const pool = await getConnection();
    const [result] = await pool.query("DELETE FROM products WHERE id = ?", [
      id,
    ]);
    return result.affectedRows > 0;
  },

  // Helper to parse JSON fields
  _parseProduct(row) {
    return {
      id: row.id,
      sellerId: row.seller_id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      basePrice: parseFloat(row.base_price),
      variantOptions:
        typeof row.variant_options === "string"
          ? JSON.parse(row.variant_options)
          : row.variant_options,
      variantVariables:
        typeof row.variant_variables === "string"
          ? JSON.parse(row.variant_variables)
          : row.variant_variables,
      mainImages:
        typeof row.main_images === "string"
          ? JSON.parse(row.main_images)
          : row.main_images,
      specifications:
        typeof row.specifications === "string"
          ? JSON.parse(row.specifications)
          : row.specifications,
      tags: typeof row.tags === "string" ? JSON.parse(row.tags) : row.tags,
      averageRating: parseFloat(row.average_rating),
      totalReviews: row.total_reviews,
      totalSold: row.total_sold,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      seller: row.seller_username
        ? {
            id: row.seller_id,
            username: row.seller_username,
            firstName: row.seller_first_name,
            lastName: row.seller_last_name,
          }
        : null,
    };
  },

  // Count products
  async count(options = {}) {
    const pool = await getConnection();
    const { sellerId, categoryId, isActive = true } = options;

    let query = "SELECT COUNT(*) as total FROM products WHERE 1=1";
    const values = [];

    if (isActive !== null) {
      query += " AND is_active = ?";
      values.push(isActive);
    }
    if (sellerId) {
      query += " AND seller_id = ?";
      values.push(sellerId);
    }
    if (categoryId) {
      query +=
        " AND id IN (SELECT product_id FROM product_categories WHERE category_id = ?)";
      values.push(categoryId);
    }

    const [rows] = await pool.query(query, values);
    return rows[0].total;
  },

  // Search products
  async search(query, limit = 10, offset = 0) {
    const pool = await getConnection();
    const searchTerm = `%${query}%`;

    const [rows] = await pool.query(
      `SELECT p.*, u.username as seller_username
       FROM products p
       LEFT JOIN users u ON p.seller_id = u.id
       WHERE p.is_active = true 
         AND (p.name LIKE ? OR p.description LIKE ? OR p.tags LIKE ?)
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      [searchTerm, searchTerm, searchTerm, limit, offset],
    );

    const [countRows] = await pool.query(
      `SELECT COUNT(*) as total FROM products 
       WHERE is_active = true 
         AND (name LIKE ? OR description LIKE ? OR tags LIKE ?)`,
      [searchTerm, searchTerm, searchTerm],
    );

    return {
      products: rows.map((row) => this._parseProduct(row)),
      total: countRows[0].total,
    };
  },

  // Add variants to a product
  async addVariants(productId, variants) {
    const pool = await getConnection();

    for (let i = 0; i < variants.length; i++) {
      const variant = variants[i];
      await pool.query(
        `INSERT INTO product_variants (product_id, attributes, sku, price, quantity, images, variant_index)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          productId,
          JSON.stringify(variant.attributes || variant),
          variant.sku || null,
          variant.price || 0,
          variant.quantity || variant.stock || 0,
          JSON.stringify(variant.images || []),
          i,
        ],
      );
    }
    return true;
  },

  // Add categories to a product
  async addCategories(productId, categoryIds) {
    const pool = await getConnection();
    const values = categoryIds.map((catId) => [productId, catId]);
    await pool.query(
      "INSERT INTO product_categories (product_id, category_id) VALUES ?",
      [values],
    );
    return true;
  },
};

export default Product;
