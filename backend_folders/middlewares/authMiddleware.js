import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

// Protected Routes
export const requireSignIn = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token format" });
    }

    // Verify token
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { _id: ... }
    next();
  } catch (error) {
    console.error("RequireSignIn Middleware Error:", error);
    return res
      .status(401)
      .json({ success: false, message: "Token is invalid or expired", error });
  }
};

// Admin Access Middleware
export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    if (user.role !== 1) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized access" });
    }

    next();
  } catch (error) {
    console.error("Admin Middleware Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error in admin middleware", error });
  }
};
