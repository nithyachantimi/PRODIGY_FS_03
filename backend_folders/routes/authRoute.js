import express from "express";
import {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  updateProfileController,
  getOrdersController,
  getAllOrdersController,
  orderStatusController,
  userAuthController,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

// REGISTER || METHOD POST
router.post("/register", registerController);

// LOGIN || POST
router.post("/login", loginController);

// Forgot Password || POST
router.post("/forgot-password", forgotPasswordController);

// Test routes
router.get("/test", requireSignIn, isAdmin, testController);

// Protected user route auth
router.get("/user-auth", requireSignIn, userAuthController);

// Admin protected route
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

// Update profile
router.put("/profile", requireSignIn, updateProfileController);

// User orders
router.get("/orders", requireSignIn, getOrdersController);

// All orders (Admin)
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

// Orders status update
router.put("/order-status/:orderId", requireSignIn, isAdmin, orderStatusController);

export default router;
