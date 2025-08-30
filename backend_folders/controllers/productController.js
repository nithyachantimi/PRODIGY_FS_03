import fs from "fs";
import slugify from "slugify";
import braintree from "braintree";
import dotenv from "dotenv";
import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import orderModel from "../models/orderModel.js";

dotenv.config();

// ==========================
// Braintree Gateway Config
// ==========================
const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

// ==========================
// Create Product
// ==========================
export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields || {};
    const { photo } = req.files || {};

    switch (true) {
      case !name:
        return res.status(400).send({ error: "Name is required" });
      case !description:
        return res.status(400).send({ error: "Description is required" });
      case !price:
        return res.status(400).send({ error: "Price is required" });
      case !category:
        return res.status(400).send({ error: "Category is required" });
      case !quantity:
        return res.status(400).send({ error: "Quantity is required" });
      case photo && photo.size > 1_000_000:
        return res.status(400).send({ error: "Photo should be less than 1MB" });
    }

    const product = new productModel({
      ...req.fields,
      slug: slugify(name, { lower: true, strict: true }),
    });

    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    await product.save();

    return res.status(201).send({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create Product Error:", error);
    return res.status(500).send({
      success: false,
      message: "Error in creating product",
      error: error.message,
    });
  }
};

// ==========================
// Get All Products
// ==========================
export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      countTotal: products.length,
      message: "All products",
      products,
    });
  } catch (error) {
    console.error("Get Products Error:", error);
    return res.status(500).send({
      success: false,
      message: "Error while fetching products",
      error: error.message,
    });
  }
};

// ==========================
// Get Single Product
// ==========================
export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");

    if (!product) {
      return res
        .status(404)
        .send({ success: false, message: "Product not found" });
    }

    return res.status(200).send({
      success: true,
      message: "Single product fetched",
      product,
    });
  } catch (error) {
    console.error("Get Single Product Error:", error);
    return res.status(500).send({
      success: false,
      message: "Error while getting single product",
      error: error.message,
    });
  }
};

// ==========================
// Get Product Photo
// ==========================
export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (!product || !product.photo?.data) {
      return res
        .status(404)
        .send({ success: false, message: "Photo not found" });
    }

    res.set("Content-Type", product.photo.contentType);
    return res.status(200).send(product.photo.data);
  } catch (error) {
    console.error("Get Photo Error:", error);
    return res.status(500).send({
      success: false,
      message: "Error while getting product photo",
      error: error.message,
    });
  }
};

// ==========================
// Delete Product
// ==========================
export const deleteProductController = async (req, res) => {
  try {
    const deleted = await productModel
      .findByIdAndDelete(req.params.pid)
      .select("-photo");
    if (!deleted) {
      return res
        .status(404)
        .send({ success: false, message: "Product not found" });
    }
    return res.status(200).send({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete Product Error:", error);
    return res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error: error.message,
    });
  }
};

// ==========================
// Update Product
// ==========================
export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields || {};
    const { photo } = req.files || {};

    switch (true) {
      case !name:
        return res.status(400).send({ error: "Name is required" });
      case !description:
        return res.status(400).send({ error: "Description is required" });
      case !price:
        return res.status(400).send({ error: "Price is required" });
      case !category:
        return res.status(400).send({ error: "Category is required" });
      case !quantity:
        return res.status(400).send({ error: "Quantity is required" });
      case photo && photo.size > 1_000_000:
        return res.status(400).send({ error: "Photo should be less than 1MB" });
    }

    const product = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name, { lower: true, strict: true }) },
      { new: true }
    );

    if (!product) {
      return res
        .status(404)
        .send({ success: false, message: "Product not found" });
    }

    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
      await product.save();
    }

    return res.status(200).send({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update Product Error:", error);
    return res.status(500).send({
      success: false,
      message: "Error in updating product",
      error: error.message,
    });
  }
};

// ==========================
// Filters
// ==========================
export const productFiltersController = async (req, res) => {
  try {
    const { checked = [], radio = [] } = req.body || {};
    const args = {};
    if (checked.length) args.category = { $in: checked };
    if (radio.length === 2) args.price = { $gte: radio[0], $lte: radio[1] };

    const products = await productModel
      .find(args)
      .select("-photo")
      .populate("category");
    return res.status(200).send({ success: true, products });
  } catch (error) {
    console.error("Filter Products Error:", error);
    return res.status(500).send({
      success: false,
      message: "Error while fetching filtered products",
      error: error.message,
    });
  }
};

// ==========================
// Product Count
// ==========================
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.estimatedDocumentCount();
    return res.status(200).send({ success: true, total });
  } catch (error) {
    console.error("Count Error:", error);
    return res.status(400).send({
      success: false,
      message: "Error in product count",
      error: error.message,
    });
  }
};

// ==========================
// Product List (Pagination)
// ==========================
export const productListController = async (req, res) => {
  try {
    const perPage = Number(req.query.perPage) || 6;
    const page = Number(req.params.page || req.query.page || 1);

    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    return res.status(200).send({ success: true, products });
  } catch (error) {
    console.error("Pagination Error:", error);
    return res.status(400).send({
      success: false,
      message: "Error in per page controller",
      error: error.message,
    });
  }
};

// ==========================
// Search Product
// ==========================
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;

    if (!keyword || keyword.trim() === "") {
      return res.json([]);
    }

    const results = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");

    return res.json(results);
  } catch (error) {
    console.error("Search Error:", error);
    return res.status(500).send({
      success: false,
      message: "Error in search product controller",
      error: error.message,
    });
  }
};

// ==========================
// Related Products
// ==========================
export const relatedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(3)
      .populate("category");

    return res.status(200).send({ success: true, products });
  } catch (error) {
    console.error("Related Products Error:", error);
    return res.status(400).send({
      success: false,
      message: "Error while getting related products",
      error: error.message,
    });
  }
};

// ==========================
// Get Products by Category
// ==========================
export const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }

    const products = await productModel
      .find({ category })
      .populate("category")
      .select("-photo");

    return res.status(200).send({
      success: true,
      category,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Category Products Error:", error);
    return res.status(500).send({
      success: false,
      message: "Error while getting products by category",
      error: error.message,
    });
  }
};

// ==========================
// Braintree Token
// ==========================
export const braintreeTokenController = async (req, res) => {
  try {
    console.log("Generating Braintree client token...");

    // Check if Braintree credentials are configured
    if (
      !process.env.BRAINTREE_MERCHANT_ID ||
      !process.env.BRAINTREE_PUBLIC_KEY ||
      !process.env.BRAINTREE_PRIVATE_KEY
    ) {
      console.error("Braintree credentials not configured");
      return res.status(500).send({
        success: false,
        error: "Payment gateway not configured. Please contact administrator.",
      });
    }

    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        console.error("Braintree token generation error:", err);
        return res.status(500).send({
          success: false,
          error: err.message || "Failed to generate payment token",
        });
      }

      if (!response || !response.clientToken) {
        console.error("No client token in response");
        return res.status(500).send({
          success: false,
          error: "Invalid response from payment gateway",
        });
      }

      console.log("Braintree client token generated successfully");
      return res.send({ clientToken: response.clientToken });
    });
  } catch (error) {
    console.error("Token Error:", error);
    return res.status(500).send({
      success: false,
      error: error.message || "Internal server error",
    });
  }
};

// ==========================
// Braintree Payment
// ==========================
export const braintreePaymentController = async (req, res) => {
  try {
    console.log("Processing payment request...");
    const { cart = [], nonce, cardDetails } = req.body || {};

    if (!Array.isArray(cart) || cart.length === 0) {
      console.log("Cart is empty");
      return res.status(400).send({ success: false, message: "Cart is empty" });
    }

    // For demo purposes, we'll accept either nonce or cardDetails
    if (!nonce && !cardDetails) {
      console.log("No payment method provided");
      return res
        .status(400)
        .send({ success: false, message: "Payment method is required" });
    }

    console.log("Calculating total amount...");
    const totalNumber = cart.reduce((sum, item) => {
      const itemPrice = Number(item.price) || 0;
      const qty = Number(item.quantity || 1);
      return sum + itemPrice * qty;
    }, 0);

    const amount = totalNumber.toFixed(2);
    console.log("Total amount:", amount);

    // For demo purposes, we'll simulate payment processing
    console.log("Processing payment...");

    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulate payment success (in real implementation, you'd process with Braintree)
    const paymentResult = {
      success: true,
      transaction: {
        id: `txn_${Date.now()}`,
        amount: amount,
        status: "authorized",
        paymentMethod: cardDetails ? "credit_card" : "braintree",
        cardDetails: cardDetails
          ? {
              last4: cardDetails.number.slice(-4),
              cardType: "visa", // You'd determine this from the card number
            }
          : null,
      },
    };

    console.log("Payment successful, creating order...");
    try {
      // Extract product IDs from cart items for the order
      const productIds = cart.map((item) => item._id);

      const order = new orderModel({
        products: productIds,
        payment: paymentResult,
        buyer: req.user?._id,
      });
      await order.save();

      console.log("Order created successfully");
      return res.json({
        success: true,
        message: "Payment successful",
        result: paymentResult,
      });
    } catch (orderError) {
      console.error("Order save error:", orderError);
      return res.status(500).send({
        success: false,
        message: "Payment successful but order could not be saved",
        error: orderError.message,
      });
    }
  } catch (error) {
    console.error("Payment Error:", error);
    return res
      .status(500)
      .send({ success: false, message: "Payment error", error: error.message });
  }
};

// ==========================
// Mock Payment (for testing)
// ==========================
export const mockPaymentController = async (req, res) => {
  try {
    console.log("Processing mock payment request...");
    const { cart = [] } = req.body || {};

    if (!Array.isArray(cart) || cart.length === 0) {
      console.log("Cart is empty");
      return res.status(400).send({ success: false, message: "Cart is empty" });
    }

    console.log("Calculating total amount...");
    const totalNumber = cart.reduce((sum, item) => {
      const itemPrice = Number(item.price) || 0;
      const qty = Number(item.quantity || 1);
      return sum + itemPrice * qty;
    }, 0);

    const amount = totalNumber.toFixed(2);
    console.log("Total amount:", amount);

    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Mock payment successful, creating order...");
    try {
      // Extract product IDs from cart items for the order
      const productIds = cart.map((item) => item._id);

      const order = new orderModel({
        products: productIds,
        payment: {
          success: true,
          transaction: {
            id: `mock_${Date.now()}`,
            amount: amount,
            status: "authorized",
          },
        },
        buyer: req.user?._id,
      });
      await order.save();

      console.log("Mock order created successfully");
      return res.json({
        success: true,
        message: "Mock payment successful",
        transactionId: `mock_${Date.now()}`,
      });
    } catch (orderError) {
      console.error("Mock order save error:", orderError);
      return res.status(500).send({
        success: false,
        message: "Mock payment successful but order could not be saved",
        error: orderError.message,
      });
    }
  } catch (error) {
    console.error("Mock Payment Error:", error);
    return res.status(500).send({
      success: false,
      message: "Mock payment error",
      error: error.message,
    });
  }
};
