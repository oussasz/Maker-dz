import express from "express";
import {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  markHelpful,
} from "../../controllers/mysql/reviewController.js";
import { authenticateUser } from "../../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.get("/products/:productId/reviews", getProductReviews);

// Auth required
router.post("/products/:productId/reviews", authenticateUser, createReview);
router.put("/reviews/:reviewId", authenticateUser, updateReview);
router.delete("/reviews/:reviewId", authenticateUser, deleteReview);
router.post("/reviews/:reviewId/helpful", authenticateUser, markHelpful);

export default router;
