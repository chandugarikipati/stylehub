const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    // Basic product information
    name: {
      type: String,
      required: true,
      trim: true,
    },

    brand: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    // Pricing
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    originalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Category
    category: {
      type: String,
      enum: ["men", "women", "kids", "accessories"],
      required: true,
    },

    gender: {
      type: String,
      enum: ["Men", "Women", "Unisex"],
      required: true,
    },

    // Product images
    image: {
      type: String,
      required: true,
      trim: true,
    },

    images: {
      type: [String],
      default: [],
    },

    // Product options
    sizes: {
      type: [String],
      default: [],
    },

    colors: {
      type: [String],
      default: [],
    },

    colorHex: {
      type: [String],
      default: [],
    },

    // Stock
    inStock: {
      type: Boolean,
      default: true,
    },

    stockCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Product status
    newArrival: {
      type: Boolean,
      default: false,
    },

    isBestSeller: {
      type: Boolean,
      default: false,
    },

    isTrending: {
      type: Boolean,
      default: false,
    },

    // Reviews
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Additional information
    material: {
      type: String,
      default: "",
    },

    fit: {
      type: String,
      default: "",
    },

    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);