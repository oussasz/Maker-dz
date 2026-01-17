import express from "express";
import {
  addToCart,
  getCart,
  updateCart,
  removeFromCart,
  clearCart,
} from "../../controllers/mysql/cartController.js";
import { authenticateUser } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/cart", authenticateUser, getCart);
router.post("/cart", authenticateUser, addToCart);
router.put("/cart", authenticateUser, updateCart);
router.delete("/cart/item", authenticateUser, removeFromCart);
router.delete("/cart", authenticateUser, clearCart);

export default router;
