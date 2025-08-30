import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  createCategoryController,
  updateCategoryController,
  categoryController,
  singleCategoryController,
  deleteCategoryController,
} from "../controllers/categoryController.js";

const router = express.Router();

// =============================
// Category Routes
// =============================

// Create category (Admin only)
router.post("/create-category", requireSignIn, isAdmin, createCategoryController);

// Update category (Admin only)
router.put("/update-category/:id", requireSignIn, isAdmin, updateCategoryController);

// Get all categories (Public)
router.get("/get-category", categoryController);

// Get single category by slug (Public)
router.get("/single-category/:slug", singleCategoryController);

// Delete category (Admin only)
router.delete("/delete-category/:id", requireSignIn, isAdmin, deleteCategoryController);

export default router;
