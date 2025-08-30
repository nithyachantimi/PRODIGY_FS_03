import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Uncommented to enforce validation
      unique: true,
    },
    slug: {
      type: String,
      lowercase: true,
      unique: true,
    },
  },
  { timestamps: true } // Optional: to track createdAt and updatedAt
);

export default mongoose.model("Category", categorySchema);
