import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String, // Changed from {} to String for simplicity
      required: true,
    },
    answer: {
      type: String,
      required: true, // Fixed typo from 'requird' to 'required'
    },
    role: {
      type: Number,
      default: 0, // 0 => user, 1 => admin
    },
  },
  { timestamps: true }
);

export default mongoose.model("users", userSchema);
