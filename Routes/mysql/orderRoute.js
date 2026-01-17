import express from "express";
import {
  createOrder,
  getOrders,
  getOrder,
  getSellerOrders,
  updateOrderStatus,
  getDashboardData,
  updateSellerOrders,
} from "../../controllers/mysql/orderController.js";
import { authenticateUser } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/orders", authenticateUser, createOrder);
router.get("/orders", authenticateUser, getOrders);
router.get("/orders/:orderId", authenticateUser, getOrder);
router.put("/orders/:orderId/status", authenticateUser, updateOrderStatus);
router.get("/sellers/:sellerId/orders", authenticateUser, getSellerOrders);
router.put("/sellers/:sellerId/orders", authenticateUser, updateSellerOrders);
router.get("/sellers/:sellerId/dashboard", authenticateUser, getDashboardData);

export default router;
