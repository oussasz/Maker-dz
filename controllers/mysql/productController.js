import { Product, Category, User } from "../../models/mysql/index.js";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import sharp from "sharp";
import slugify from "slugify";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to upload to Cloudinary
const uploadToCloudinary = async (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: "image",
        transformation: [{ width: 1280, crop: "limit", quality: 80 }],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      },
    );
    uploadStream.end(buffer);
  });
};

// Helper function to generate URL-friendly slug
const generateSlug = (name) => {
  const hasArabic = /[\u0600-\u06FF]/.test(name);
  const options = { lower: true, trim: true };
  if (hasArabic) options.locale = "ar";
  return slugify(name, options);
};

/**
 * Create a new product with variants
 */
export const createProduct = async (req, res) => {
  try {
    if (req.user.role !== "seller") {
      return res.status(403).json({ error: "Only sellers are allowed" });
    }

    const {
      name,
      description,
      basePrice,
      categories,
      tags,
      specifications,
      variants,
      variantOptions,
      variantVariables,
      isFeatured,
    } = req.body;

    if (!name || !description || !basePrice) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // Parse JSON fields
    const parsedVariants =
      typeof variants === "string" ? JSON.parse(variants) : variants;
    const parsedCategories =
      typeof categories === "string" ? JSON.parse(categories) : categories;
    const parsedSpecs =
      typeof specifications === "string"
        ? JSON.parse(specifications)
        : specifications;
    const parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;
    const parsedVariantOptions =
      typeof variantOptions === "string"
        ? JSON.parse(variantOptions)
        : variantOptions;
    const parsedVariantVariables =
      typeof variantVariables === "string"
        ? JSON.parse(variantVariables)
        : variantVariables;

    const files = req.files || [];

    // Upload main images to Cloudinary
    const productImageFiles = files.filter(
      (f) => f.fieldname === "productImages",
    );
    const mainImages = await Promise.all(
      productImageFiles.map(async (file) => {
        const optimizedBuffer = await sharp(file.buffer)
          .resize({ width: 1280 })
          .jpeg({ quality: 80 })
          .toBuffer();
        return await uploadToCloudinary(optimizedBuffer, "maker-dz/products");
      }),
    );

    // Upload variant images
    const variantImageFiles = files.filter((file) =>
      file.fieldname.startsWith("variantImages_"),
    );
    await Promise.all(
      variantImageFiles.map(async (file) => {
        const index = file.fieldname.split("_")[1];
        if (!parsedVariants[index].images) parsedVariants[index].images = [];
        const optimizedBuffer = await sharp(file.buffer)
          .resize({ width: 1280 })
          .jpeg({ quality: 80 })
          .toBuffer();
        const url = await uploadToCloudinary(
          optimizedBuffer,
          "maker-dz/variants",
        );
        parsedVariants[index].images.push(url);
      }),
    );

    // Generate unique slug
    let slug = generateSlug(name);
    let exists = await Product.findBySlug(slug);
    let counter = 1;
    while (exists) {
      slug = `${generateSlug(name)}-${counter}`;
      exists = await Product.findBySlug(slug);
      counter++;
    }

    // Create product
    const productId = await Product.create({
      seller_id: req.user.id,
      name,
      slug,
      description,
      base_price: parseFloat(basePrice),
      main_images: JSON.stringify(mainImages),
      specifications: JSON.stringify(parsedSpecs),
      variant_options: JSON.stringify(parsedVariantOptions),
      variant_variables: JSON.stringify(parsedVariantVariables),
      tags: JSON.stringify(parsedTags),
      is_featured: isFeatured === "true" || isFeatured === true,
    });

    // Add variants
    if (parsedVariants && parsedVariants.length > 0) {
      await Product.addVariants(productId, parsedVariants);
    }

    // Add category associations
    if (parsedCategories && parsedCategories.length > 0) {
      await Product.addCategories(productId, parsedCategories);
    }

    const product = await Product.findById(productId);

    return res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({
      error: "Error creating product",
      details: error.message,
    });
  }
};

/**
 * Get all products with pagination, sorting, and filtering
 */
export const getProducts = async (req, res) => {
  try {
    console.log("Fetching products with query:", req.query);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const sort = req.query.sort || "created_at DESC";

    const filters = {
      is_active: true,
    };

    if (req.query.category) filters.category_id = req.query.category;
    if (req.query.seller) filters.seller_id = req.query.seller;
    if (req.query.featured === "true") filters.is_featured = true;
    if (req.query.minPrice) filters.min_price = parseFloat(req.query.minPrice);
    if (req.query.maxPrice) filters.max_price = parseFloat(req.query.maxPrice);

    console.log("Product filters:", filters);
    const { products, total } = await Product.findAll({
      filters,
      limit,
      offset,
      sort,
    });

    console.log(`Found ${products.length} products out of ${total} total`);
    res.status(200).json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    console.error("Error stack:", error.stack);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      sqlMessage: error.sqlMessage,
      sql: error.sql
    });
    res.status(500).json({ 
      error: "Error fetching products",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get single product by ID or slug
 */
export const getProduct = async (req, res) => {
  try {
    const { identifier } = req.params;

    // Try to find by ID first, then by slug
    let product = await Product.findById(identifier);
    if (!product) {
      product = await Product.findBySlug(identifier);
    }

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Get variants and categories
    product.variants = await Product.getVariants(product.id);
    product.categories = await Product.getCategories(product.id);

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res
      .status(500)
      .json({ error: "Error fetching product", details: error.message });
  }
};

/**
 * Get products by category
 */
export const getProductsByCategory = async (req, res) => {
  try {
    const { categorySlug } = req.params;

    const category = await Category.findBySlug(categorySlug);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    const { products } = await Product.findAll({
      filters: { category_id: category.id, is_active: true },
      limit: 100,
      offset: 0,
    });

    res.json({
      category: {
        name: category.name,
        slug: category.slug,
        description: category.description,
      },
      products,
    });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Get all products from a specific seller
 */
export const getSellerProducts = async (req, res) => {
  try {
    const { sellerId } = req.params;

    const seller = await User.findById(sellerId);
    if (!seller || seller.role !== "seller") {
      return res.status(404).json({ error: "Seller not found" });
    }

    const { products } = await Product.findAll({
      filters: { seller_id: sellerId, is_active: true },
      limit: 100,
      offset: 0,
      sort: "created_at DESC",
    });

    res.status(200).json({
      seller: {
        id: seller.id,
        username: seller.username,
      },
      products,
    });
  } catch (error) {
    console.error("Error fetching seller products:", error);
    res.status(500).json({ error: "Error fetching seller products" });
  }
};

/**
 * Update a product
 */
export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.seller_id !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "You can only update your own products" });
    }

    const updates = {};
    const {
      name,
      description,
      basePrice,
      isActive,
      isFeatured,
      specifications,
      tags,
    } = req.body;

    if (name) {
      updates.name = name;
      let slug = generateSlug(name);
      let exists = await Product.findBySlug(slug);
      let counter = 1;
      while (exists && exists.id !== parseInt(productId)) {
        slug = `${generateSlug(name)}-${counter}`;
        exists = await Product.findBySlug(slug);
        counter++;
      }
      updates.slug = slug;
    }
    if (description) updates.description = description;
    if (basePrice) updates.base_price = parseFloat(basePrice);
    if (isActive !== undefined) updates.is_active = isActive;
    if (isFeatured !== undefined) updates.is_featured = isFeatured;
    if (specifications) updates.specifications = JSON.stringify(specifications);
    if (tags) updates.tags = JSON.stringify(tags);

    await Product.updateById(productId, updates);
    const updatedProduct = await Product.findById(productId);

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Error updating product" });
  }
};

/**
 * Delete a product (soft delete)
 */
export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.seller_id !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "You can only delete your own products" });
    }

    await Product.updateById(productId, { is_active: false });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Error deleting product" });
  }
};

/**
 * Search products
 */
export const searchProducts = async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    if (!q) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const { products, total } = await Product.search(
      q,
      parseInt(limit),
      offset,
    );

    res.status(200).json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ error: "Error searching products" });
  }
};
