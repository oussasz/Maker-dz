import { Review, Product } from "../../models/mysql/index.js";
import { Order } from "../../models/mysql/index.js";
import { getConnection } from "../../config/database.js";

/**
 * Resolve a productId param that may be a numeric ID or a slug.
 * Returns the numeric product ID, or null if not found.
 */
async function resolveProductId(param) {
  // If it's a number, use it directly
  if (/^\d+$/.test(param)) return Number(param);
  // Otherwise treat as slug
  const product = await Product.findBySlug(param);
  return product ? product.id : null;
}

/**
 * GET /api/products/:productId/reviews?page=1&limit=10&sort=recent
 */
export const getProductReviews = async (req, res) => {
  try {
    const numericId = await resolveProductId(req.params.productId);
    if (!numericId) {
      return res.status(404).json({ error: "Product not found" });
    }
    const productId = numericId;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const offset = (page - 1) * limit;
    const sort = req.query.sort || "recent"; // recent | helpful | highest | lowest

    const pool = await getConnection();

    // Build ORDER BY clause
    let orderBy;
    switch (sort) {
      case "helpful":
        orderBy = "r.helpful_count DESC, r.created_at DESC";
        break;
      case "highest":
        orderBy = "r.rating DESC, r.created_at DESC";
        break;
      case "lowest":
        orderBy = "r.rating ASC, r.created_at DESC";
        break;
      default:
        orderBy = "r.created_at DESC";
    }

    const [reviews] = await pool.query(
      `SELECT r.*, u.username, u.first_name, u.avatar
       FROM reviews r
       LEFT JOIN users u ON r.user_id = u.id
       WHERE r.product_id = ?
       ORDER BY ${orderBy}
       LIMIT ? OFFSET ?`,
      [productId, limit, offset],
    );

    const formattedReviews = reviews.map((row) => ({
      ...row,
      images:
        typeof row.images === "string"
          ? JSON.parse(row.images)
          : row.images || [],
      user: {
        id: row.user_id,
        username: row.username,
        firstName: row.first_name,
        avatar: row.avatar,
      },
    }));

    // Get total count for pagination
    const [[{ total }]] = await pool.query(
      "SELECT COUNT(*) as total FROM reviews WHERE product_id = ?",
      [productId],
    );

    // Get stats
    const stats = await Review.getProductStats(productId);

    return res.status(200).json({
      reviews: formattedReviews,
      stats: {
        total: Number(stats.total),
        average: stats.average
          ? parseFloat(Number(stats.average).toFixed(1))
          : 0,
        distribution: {
          5: Number(stats.five_star) || 0,
          4: Number(stats.four_star) || 0,
          3: Number(stats.three_star) || 0,
          2: Number(stats.two_star) || 0,
          1: Number(stats.one_star) || 0,
        },
      },
      pagination: {
        page,
        limit,
        total: Number(total),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("getProductReviews error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * POST /api/products/:productId/reviews
 * Body: { rating, title, comment, images }
 * Auth required
 */
export const createReview = async (req, res) => {
  try {
    const numericId = await resolveProductId(req.params.productId);
    if (!numericId) {
      return res.status(404).json({ error: "Product not found" });
    }
    const productId = numericId;
    const userId = req.user.id;
    const { rating, title, comment, images } = req.body;

    // Validate rating
    if (!rating || rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      return res
        .status(400)
        .json({ error: "Rating must be an integer between 1 and 5" });
    }

    // Check uniqueness — one review per user per product
    const existing = await Review.findByUserAndProduct(userId, productId);
    if (existing) {
      return res
        .status(409)
        .json({ error: "You have already reviewed this product" });
    }

    // Check if user has purchased & received this product (verified purchase)
    const pool = await getConnection();
    const [purchaseRows] = await pool.query(
      `SELECT o.id as order_id
       FROM orders o
       JOIN order_items oi ON oi.order_id = o.id
       WHERE o.user_id = ? AND oi.product_id = ? AND o.order_status = 'delivered'
       LIMIT 1`,
      [userId, productId],
    );

    const isVerifiedPurchase = purchaseRows.length > 0;
    const orderId = purchaseRows[0]?.order_id || null;

    const review = await Review.create({
      productId,
      userId,
      orderId,
      rating,
      title: title || null,
      comment: comment || null,
      images: images || [],
      isVerifiedPurchase,
    });

    return res.status(201).json(review);
  } catch (error) {
    console.error("createReview error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * PUT /api/reviews/:reviewId
 * Body: { rating, title, comment, images }
 * Auth required — owner only
 */
export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;
    const { rating, title, comment, images } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    if (review.user_id !== userId) {
      return res
        .status(403)
        .json({ error: "You can only edit your own reviews" });
    }

    if (
      rating !== undefined &&
      (rating < 1 || rating > 5 || !Number.isInteger(rating))
    ) {
      return res
        .status(400)
        .json({ error: "Rating must be an integer between 1 and 5" });
    }

    const updated = await Review.updateById(reviewId, {
      rating,
      title,
      comment,
      images,
    });

    return res.status(200).json(updated);
  } catch (error) {
    console.error("updateReview error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * DELETE /api/reviews/:reviewId
 * Auth required — owner or admin
 */
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    if (review.user_id !== userId && userRole !== "admin") {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this review" });
    }

    await Review.deleteById(reviewId);

    return res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("deleteReview error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * POST /api/reviews/:reviewId/helpful
 * Auth required
 */
export const markHelpful = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    const updated = await Review.incrementHelpful(reviewId);

    return res.status(200).json({ helpful_count: updated.helpful_count });
  } catch (error) {
    console.error("markHelpful error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
