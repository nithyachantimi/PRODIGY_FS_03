import express from "express";
import formidable from "express-formidable";
import {
  createProductController,
  getProductController,
  getSingleProductController,
  productPhotoController,
  deleteProductController,
  updateProductController,
  productCountController,
  productListController,
  productFiltersController,
  searchProductController,
  relatedProductController,
  productCategoryController,
  braintreeTokenController,
  braintreePaymentController,
  mockPaymentController,
} from "../controllers/productController.js";

import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

// =============================
// Product Routes
// =============================

// Create product
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);

// Update product
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

// Get all products
router.get("/get-product", getProductController);

// Get single product
router.get("/get-product/:slug", getSingleProductController);

// Get product photo
router.get("/product-photo/:pid", productPhotoController);

// Delete product
router.delete(
  "/delete-product/:pid",
  requireSignIn,
  isAdmin,
  deleteProductController
);

// Filter products
router.post("/product-filters", productFiltersController);

// Product count
router.get("/product-count", productCountController);

// Product per page
router.get("/product-list/:page", productListController);

// Search product
router.get("/search/:keyword", searchProductController);

// Similar products
router.get("/related-product/:pid/:cid", relatedProductController);

// Category-wise products
router.get("/product-category/:slug", productCategoryController);

// =============================
// Payment Routes
// =============================

// Get Braintree token
router.get("/braintree/token", requireSignIn, braintreeTokenController);

// Process payment
router.post("/braintree/payment", requireSignIn, braintreePaymentController);

// Mock payment (for testing)
router.post("/mock-payment", requireSignIn, mockPaymentController);

export default router;
