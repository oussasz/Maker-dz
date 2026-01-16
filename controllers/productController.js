import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Review from "../models/Review.js";
import User from "../models/SimpleUser.js";
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
      }
    );
    uploadStream.end(buffer);
  });
};

const generateUniqueFilename = (file) => {
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  return file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname);
};

// Helper function to generate URL-friendly slug
const generateSlug = (name) => {
  // Detect if text contains Arabic
  const hasArabic = /[\u0600-\u06FF]/.test(name);

  const options = {
    lower: true,
    trim: true,
  };

  if (hasArabic) {
    options.locale = "ar"; // Better Arabic handling
  }

  return slugify(name, options);
};

/**
 * Create a new product with variants
 * POST /api/products
 * Body: {
 *   name, description, basePrice, categories (array of IDs),
 *   tags, specifications, variants: [{size, color, material, price, stock}]
 * }
 * Files: mainImages[]
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

    // Convert JSON fields
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

    // ---------------------------------------
    // ⚡ COMPRESS + UPLOAD MAIN IMAGES IN PARALLEL (Cloudinary)
    // ---------------------------------------
    const productImageFiles = files.filter(
      (f) => f.fieldname === "productImages"
    );

    const mainImages = await Promise.all(
      productImageFiles.map(async (file) => {
        const optimizedBuffer = await sharp(file.buffer)
          .resize({ width: 1280 })
          .jpeg({ quality: 80 })
          .toBuffer();

        return await uploadToCloudinary(optimizedBuffer, "maker-dz/products");
      })
    );

    // ---------------------------------------
    // ⚡ COMPRESS + UPLOAD VARIANT IMAGES IN PARALLEL (Cloudinary)
    // ---------------------------------------
    const variantImageFiles = files.filter((file) =>
      file.fieldname.startsWith("variantImages_")
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
          "maker-dz/variants"
        );
        parsedVariants[index].images.push(url);
      })
    );

    // ---------------------------------------
    // CREATE UNIQUE SLUG
    // ---------------------------------------
    let slug = generateSlug(name);
    let exists = await Product.findOne({ slug });
    let counter = 1;

    while (exists) {
      slug = `${generateSlug(name)}-${counter}`;
      exists = await Product.findOne({ slug });
      counter++;
    }

    // ---------------------------------------
    // SAVE PRODUCT
    // ---------------------------------------
    const product = new Product({
      sellerId: req.user.id,
      name,
      slug,
      description,
      basePrice: parseFloat(basePrice),
      categories: parsedCategories,
      variants: parsedVariants,
      mainImages,
      specifications: parsedSpecs,
      variantOptions: parsedVariantOptions,
      variantVariables: parsedVariantVariables,
      tags: parsedTags,
      isFeatured: isFeatured === "true" || isFeatured === true,
    });

    const saved = await product.save();
    await saved.populate("categories");

    return res.status(201).json({
      message: "Product created successfully",
      product: saved,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({
      error: "Error creating product",
      details: error.message,
    });
  }
};

/*
 * Get all products with pagination, sorting, and filtering
 * GET /api/products?page=1&limit=10&sort=-createdAt&category=xxx&minPrice=0&maxPrice=1000
 */

export const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sort = req.query.sort || "-createdAt";

    let query = { isActive: true };

    // Apply filters
    if (req.query.category) {
      query.categories = req.query.category;
    }

    if (req.query.seller) {
      query.sellerId = req.query.seller;
    }

    if (req.query.featured === "true") {
      query.isFeatured = true;
    }

    if (req.query.minPrice || req.query.maxPrice) {
      query.basePrice = {};
      if (req.query.minPrice) {
        query.basePrice.$gte = parseFloat(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        query.basePrice.$lte = parseFloat(req.query.maxPrice);
      }
    }

    const products = await Product.find(query)
      .populate("categories", "name slug")
      .populate("sellerId", "username profile")
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query);

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
    res.status(500).json({ error: "Error fetching products" });
  }
};

/*
 * Get single product by ID or slug
 * GET /api/products/:identifier
 */
export const getProduct = async (req, res) => {
  try {
    const { identifier } = req.params;

    // Try to find by ID first, then by slug
    let product = await Product.findById(identifier)
      .populate("categories", "name slug")
      .populate("sellerId", "username profile email");

    if (!product) {
      product = await Product.findOne({ slug: identifier })
        .populate("categories", "name slug")
        .populate("sellerId", "username profile email");
    }

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res
      .status(500)
      .json({ error: "Error creating product", details: error.message });
  }
};

/*
 * Get products by category
 * GET /api/products/category/:categorySlug
 */
export const getProductsByCategory = async (req, res) => {
  try {
    const { categorySlug } = req.params;

    // Find category by slug
    const category = await Category.findOne({ slug: categorySlug });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    const products = await Product.find({
      categories: category._id,
      isActive: true,
    })
      .populate("categories", "name slug")
      .populate("sellerId", "username profile");

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

/*
 * Get all products from a specific seller
 * GET /api/products/seller/:sellerId
 */
export const getSellerProducts = async (req, res) => {
  try {
    const { sellerId } = req.params;

    const seller = await User.findById(sellerId);
    if (!seller || seller.role !== "seller") {
      return res.status(404).json({ error: "Seller not found" });
    }

    const products = await Product.find({
      sellerId: sellerId,
      isActive: true,
    })
      .populate("categories", "name slug")
      .sort("-createdAt");

    res.status(200).json({
      seller: {
        id: seller._id,
        username: seller.username,
        profile: seller.profile,
      },
      products,
    });
  } catch (error) {
    console.error("Error fetching seller products:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

/**
 * Advanced product filtering
 * POST /api/products/filter
 * Body: { categories, colors, materials, sizes, minPrice, maxPrice, tags }
 */
export const filterProducts = async (req, res) => {
  try {
    const {
      categories,
      colors,
      materials,
      sizes,
      minPrice,
      maxPrice,
      tags,
      minRating,
    } = req.body;

    let query = { isActive: true };

    // Filter by categories
    if (categories && categories.length > 0) {
      query.categories = { $in: categories };
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.basePrice = {};
      if (minPrice) query.basePrice.$gte = parseFloat(minPrice);
      if (maxPrice) query.basePrice.$lte = parseFloat(maxPrice);
    }

    // Filter by tags
    if (tags && tags.length > 0) {
      query.tags = { $in: tags };
    }

    // Filter by minimum rating
    if (minRating) {
      query.averageRating = { $gte: parseFloat(minRating) };
    }

    // Filter by variant properties (color, material, size)
    if (colors && colors.length > 0) {
      query["variants.color"] = { $in: colors };
    }
    if (materials && materials.length > 0) {
      query["variants.material"] = { $in: materials };
    }
    if (sizes && sizes.length > 0) {
      query["variants.size"] = { $in: sizes };
    }

    const products = await Product.find(query)
      .populate("categories", "name slug")
      .populate("sellerId", "username profile");

    res.status(200).json({
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Error filtering products:", error);
    res.status(500).json({ error: "Error filtering products" });
  }
};

/**
 * Search products by keyword
 * GET /api/products/search?keyword=shirt&categoryId=xxx
 */
export const searchProducts = async (req, res) => {
  try {
    const { keyword, categoryId } = req.query;

    if (!keyword) {
      return res.status(400).json({ error: "Keyword is required" });
    }

    let query = {
      $text: { $search: keyword },
      isActive: true,
    };

    // Optional category filter
    if (categoryId) {
      query.categories = categoryId;
    }

    const products = await Product.find(query)
      .populate("categories", "name slug")
      .populate("sellerId", "username profile")
      .sort({ score: { $meta: "textScore" } });

    res.json({
      keyword,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Update product
 * PUT /api/products/:productId
 */
export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const existingProduct = await Product.findById(productId);

    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Permission check
    if (
      existingProduct.sellerId.toString() !== req.user.id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const files = req.files || [];
    const updateData = { ...req.body };

    // -------------------------------------------------
    // PARSE JSON FIELDS (because FormData sends strings)
    // -------------------------------------------------
    const jsonFields = [
      "categories",
      "tags",
      "specifications",
      "variants",
      "variantOptions",
      "variantVariables",
    ];

    jsonFields.forEach((field) => {
      if (updateData[field]) {
        try {
          updateData[field] =
            typeof updateData[field] === "string"
              ? JSON.parse(updateData[field])
              : updateData[field];
        } catch (e) {
          console.warn(`Skipping JSON parse for ${field}, invalid JSON`);
        }
      }
    });

    // -------------------------------------------------
    // HANDLE PRODUCT-LEVEL IMAGE UPLOADS
    // -------------------------------------------------
    const mainImages = [...(existingProduct.mainImages || [])];

    const newMainImages = files.filter((f) => f.fieldname === "productImages");

    for (const file of newMainImages) {
      const fileRef = ref(storage, `products/${generateUniqueFilename(file)}`);
      await uploadBytes(fileRef, file.buffer);
      const url = await getDownloadURL(fileRef);
      mainImages.push(url);
    }

    updateData.mainImages = mainImages;

    // -------------------------------------------------
    // HANDLE VARIANT IMAGE UPLOADS
    // variantImages_0 → [file1, file2]
    // -------------------------------------------------
    const variantImages = {}; // { "0": ["url1", "url2"], ... }

    for (const file of files) {
      if (file.fieldname.startsWith("variantImages_")) {
        const index = file.fieldname.split("_")[1];

        if (!variantImages[index]) variantImages[index] = [];

        const fileRef = ref(
          storage,
          `products/variants/${generateUniqueFilename(file)}`
        );
        await uploadBytes(fileRef, file.buffer);
        const url = await getDownloadURL(fileRef);

        variantImages[index].push(url);
      }
    }

    // -------------------------------------------------
    // MERGE VARIANT IMAGES WITH EXISTING VARIANTS
    // Keep the variant structure from create endpoint
    // -------------------------------------------------
    if (updateData.variants) {
      updateData.variants = updateData.variants.map((variant, idx) => {
        const variantIndex = variant.index !== undefined ? variant.index : idx;

        return {
          ...variant,
          images: [
            ...(variant.images || []), // keep old images if frontend sends them
            ...(variantImages[variantIndex] || []), // add newly uploaded files
          ],
        };
      });
    }

    // -------------------------------------------------
    // HANDLE BOOLEAN FIELDS
    // -------------------------------------------------
    if (updateData.isFeatured !== undefined) {
      updateData.isFeatured =
        updateData.isFeatured === "true" || updateData.isFeatured === true;
    }

    // -------------------------------------------------
    // PARSE NUMERIC FIELDS
    // -------------------------------------------------
    if (updateData.basePrice) {
      updateData.basePrice = parseFloat(updateData.basePrice);
    }

    // -------------------------------------------------
    // UPDATE SLUG IF NAME CHANGED
    // -------------------------------------------------
    if (updateData.name && updateData.name !== existingProduct.name) {
      let slug = generateSlug(updateData.name);

      let exists = await Product.findOne({ slug, _id: { $ne: productId } });
      let counter = 1;

      while (exists) {
        slug = `${generateSlug(updateData.name)}-${counter}`;
        exists = await Product.findOne({ slug, _id: { $ne: productId } });
        counter++;
      }

      updateData.slug = slug;
    }

    // -------------------------------------------------
    // APPLY UPDATE
    // -------------------------------------------------
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, runValidators: true }
    )
      .populate("categories", "name slug")
      .populate("sellerId", "username profile");

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res
      .status(500)
      .json({ message: "Error updating product", error: error.message });
  }
};

/**
 * Delete product (soft delete by setting isActive to false)
 * DELETE /api/products/:productId
 */
export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if user is the seller or admin
    if (
      product.sellerId.toString() !== req.user.id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Soft delete - just mark as inactive
    product.isActive = false;
    await product.save();

    // For hard delete, uncomment this:
    // await Product.deleteOne({ _id: productId });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Get product reviews
 * GET /api/products/:productId/reviews
 */
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const reviews = await Review.find({ productId })
      .populate("userId", "username profile")
      .sort("-createdAt")
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments({ productId });

    res.json({
      averageRating: product.averageRating,
      totalReviews: product.totalReviews,
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Create/Update product review
 * POST /api/products/:productId/reviews
 * Body: { rating, title, comment, orderId }
 */
export const rateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, title, comment, orderId } = req.body;
    const userId = req.user.id;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        error: "Rating must be between 1 and 5",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ productId, userId });
    if (existingReview) {
      return res.status(400).json({
        message: "You have already reviewed this product",
      });
    }

    // Check if it's a verified purchase (optional)
    let isVerifiedPurchase = false;
    if (orderId) {
      const Order = (await import("../models/Order.js")).default;
      const order = await Order.findOne({
        _id: orderId,
        userId,
        "items.productId": productId,
        orderStatus: "delivered",
      });
      isVerifiedPurchase = !!order;
    }

    // Create review
    const review = new Review({
      productId,
      userId,
      orderId,
      rating,
      title,
      comment,
      isVerifiedPurchase,
    });

    await review.save();

    // Update product's average rating and total reviews
    const allReviews = await Review.find({ productId });
    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / allReviews.length;

    product.averageRating = Math.round(averageRating * 10) / 10;
    product.totalReviews = allReviews.length;
    await product.save();

    await review.populate("userId", "username profile");

    res.status(201).json({
      message: "Review submitted successfully",
      review,
      productRating: {
        averageRating: product.averageRating,
        totalReviews: product.totalReviews,
      },
    });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
