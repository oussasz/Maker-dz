import express from "express";
import {
  getUser,
  getSellers,
  updateUser,
  likeProduct,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  getSellerProfile,
  updateSellerProfile,
} from "../../controllers/mysql/userController.js";
import { authenticateUser } from "../../middleware/authMiddleware.js";

const router = express.Router();

// User routes
router.get("/users/:userId", getUser);
router.put("/users/:userId", authenticateUser, updateUser);
router.get("/sellers", getSellers);
router.post("/users/:userId/like/:productId", authenticateUser, likeProduct);

// Address routes
router.get("/addresses", authenticateUser, getAddresses);
router.post("/addresses", authenticateUser, addAddress);
router.put("/addresses/:addressId", authenticateUser, updateAddress);
router.delete("/addresses/:addressId", authenticateUser, deleteAddress);

// Seller profile routes
router.get("/sellers/:sellerId/profile", getSellerProfile);
router.put("/sellers/profile", authenticateUser, updateSellerProfile);

export default router;
