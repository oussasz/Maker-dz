import express from "express";
import {
  createCategory,
  getCategories,
  getCategoryBySlug,
  getSubcategories,
  updateCategory,
  deleteCategory,
} from "../../controllers/mysql/categoryController.js";
import { authenticateUser } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/categories", getCategories);
router.post("/categories", authenticateUser, createCategory);
router.get("/categories/:slug", getCategoryBySlug);
router.get("/categories/:categoryId/subcategories", getSubcategories);
router.put("/categories/:categoryId", authenticateUser, updateCategory);
router.delete("/categories/:categoryId", authenticateUser, deleteCategory);

export default router;
