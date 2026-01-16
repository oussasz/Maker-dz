import express from "express";
import {
  createCategory,
  getCategories,
} from "../controllers/categoryController.js";

const router = express.Router();

router.post("/category", createCategory);
router.get("/categories", getCategories);
router.get("/category/all", getCategories); // Legacy support

export default router;
