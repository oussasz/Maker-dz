import express from "express";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  checkWishlistItem,
} from "../../controllers/mysql/wishlistController.js";
import { authenticateUser } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/wishlist", authenticateUser, getWishlist);
router.post("/wishlist", authenticateUser, addToWishlist);
router.delete("/wishlist", authenticateUser, removeFromWishlist);
router.get("/wishlist/:productId", authenticateUser, checkWishlistItem);

export default router;
