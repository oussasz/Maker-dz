
import express from 'express';
import { addToWishlist, removeFromWishlist, getWishlist } from '../controllers/wishlistController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post("/wishlist/add", authenticateUser, addToWishlist);
router.delete("/wishlist/remove", authenticateUser, removeFromWishlist);
router.get("/wishlist", authenticateUser, getWishlist)

export default router;
