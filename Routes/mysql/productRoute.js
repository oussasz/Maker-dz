import express from "express";
import {
  getProductsByCategory,
  createProduct,
  getProduct,
  getProducts,
  getSellerProducts,
  searchProducts,
  updateProduct,
  deleteProduct,
} from "../../controllers/mysql/productController.js";
import { authenticateUser } from "../../middleware/authMiddleware.js";
import { upload } from "../../middleware/multerMiddleware.js";

const router = express.Router();

router.get("/products", getProducts);
router.post("/products", authenticateUser, upload.any(), createProduct);
router.put(
  "/products/:productId",
  authenticateUser,
  upload.any(),
  updateProduct,
);
router.delete("/products/:productId", authenticateUser, deleteProduct);
router.get("/products/:identifier", getProduct);
router.get("/sellers/:sellerId/products", getSellerProducts);
router.get("/products/categories/:categorySlug", getProductsByCategory);
router.get("/products/search/searched", searchProducts);

export default router;
