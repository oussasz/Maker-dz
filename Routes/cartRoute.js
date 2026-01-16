
import express from 'express';
import { addToCart, getUserCart, updateCartItem } from '../controllers/cartController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();


router.post("/cart/add", authenticateUser, addToCart)
router.put("/cart/item/update", authenticateUser, updateCartItem)
router.get("/cart", authenticateUser, getUserCart)


export default router;
