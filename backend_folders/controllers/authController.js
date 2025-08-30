import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "./../helpers/authHelper.js";
import JWT from "jsonwebtoken";
import orderModel from "../models/orderModel.js";

// ================== REGISTER ==================
export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;

    if (!name) return res.status(400).send({ message: "Name is required" });
    if (!email) return res.status(400).send({ message: "Email is required" });
    if (!password) return res.status(400).send({ message: "Password is required" });
    if (!phone) return res.status(400).send({ message: "Phone number is required" });
    if (!address) return res.status(400).send({ message: "Address is required" });
    if (!answer) return res.status(400).send({ message: "Security answer is required" });

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).send({
        success: false,
        message: "Already registered, please login",
      });
    }

    const hashedPassword = await hashPassword(password);
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer,
    }).save();

    res.status(201).send({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in registration",
      error,
    });
  }
};

// ================== LOGIN ==================
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({ success: false, message: "Invalid email or password" });
    }

    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).send({ success: false, message: "Email is not registered" });

    const match = await comparePassword(password, user.password);
    if (!match) return res.status(401).send({ success: false, message: "Invalid password" });

    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).send({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error in login", error });
  }
};

// ================== FORGOT PASSWORD ==================
export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) return res.status(400).send({ message: "Email is required" });
    if (!answer) return res.status(400).send({ message: "Security answer is required" });
    if (!newPassword) return res.status(400).send({ message: "New password is required" });

    const user = await userModel.findOne({ email, answer });
    if (!user) return res.status(404).send({ success: false, message: "Wrong email or answer" });

    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });

    res.status(200).send({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Something went wrong", error });
  }
};

// ================== TEST ==================
export const testController = (req, res) => {
  try {
    res.send("Protected Routes");
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};

// ================== USER AUTH CHECK ==================
export const userAuthController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ ok: true, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error in user auth check", error });
  }
};

// ================== UPDATE PROFILE ==================
export const updateProfileController = async (req, res) => {
  try {
    const { name, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);

    if (password && password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const hashedPassword = password ? await hashPassword(password) : undefined;

    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );

    res.status(200).send({ success: true, message: "Profile updated successfully", updatedUser });
  } catch (error) {
    console.log(error);
    res.status(400).send({ success: false, message: "Error while updating profile", error });
  }
};

// ================== USER ORDERS ==================
export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error while getting orders", error });
  }
};

// ================== ALL ORDERS (ADMIN) ==================
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error while getting orders", error });
  }
};

// ================== UPDATE ORDER STATUS ==================
export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });

    res.status(200).send({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error while updating order status", error });
  }
};
