const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("./models/Product");

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error("❌ MONGODB_URI / MONGO_URI is missing in .env file");
  process.exit(1);
}

// Product data
const products = [
  {
    name: "Cashmere Turtleneck Sweater",
    brand: "Chandu Premium",
    description:
      "Experience the ultimate in luxury knitwear with this pure cashmere turtleneck.",
    price: 2799,
    originalPrice: 4499,
    discount: 38,
    category: "women",
    gender: "Women",

    image:
      "https://images.unsplash.com/photo-1657373307141-349a3393d4d9",
    images: [
      "https://images.unsplash.com/photo-1657373307141-349a3393d4d9",
      "https://images.unsplash.com/photo-1651828855150-ba40f6870a53",
      "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95",
    ],

    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Cream", "Sage Green", "Dusty Rose", "Charcoal"],
    colorHex: ["#FFFDD0", "#9CAF88", "#D8A0A6", "#36454F"],

    inStock: true,
    stockCount: 42,

    newArrival: false,
    isBestSeller: true,
    isTrending: true,

    rating: 4.9,
    reviewCount: 428,

    material: "100% Cashmere",
    fit: "Regular",

    tags: ["sweater", "cashmere", "winter"],
  },

  {
    name: "Italian Wool Suit",
    brand: "Chandu Premium",
    description:
      "Our flagship suit, crafted in Italy from Super 120s wool. Fully canvassed construction for exceptional drape and longevity.",
    price: 12999,
    originalPrice: 21999,
    discount: 41,
    category: "men",
    gender: "Men",

    image:
      "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc",
    images: [
      "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc",
      "https://images.unsplash.com/photo-1617113930975-f9c7243ae527",
      "https://images.unsplash.com/photo-1622497170185-5d668f816a56",
    ],

    sizes: ["38", "40", "42", "44", "46", "48"],
    colors: ["Charcoal", "Navy", "Black"],
    colorHex: ["#36454F", "#000080", "#000000"],

    inStock: true,
    stockCount: 12,

    newArrival: true,
    isBestSeller: true,
    isTrending: true,

    rating: 4.9,
    reviewCount: 156,

    material: "Super 120s Wool",
    fit: "Tailored",

    tags: ["suit", "formal", "wool"],
  },

  {
    name: "Oxford Poplin Shirt",
    brand: "Chandu Classic",
    description:
      "The perfect shirt for every occasion. Woven from fine Egyptian cotton oxford cloth.",
    price: 1299,
    originalPrice: 2199,
    discount: 41,
    category: "men",
    gender: "Men",

    image:
      "https://images.unsplash.com/photo-1622450180332-3da1126f10a4",
    images: [
      "https://images.unsplash.com/photo-1622450180332-3da1126f10a4",
      "https://images.unsplash.com/photo-1617113930975-f9c7243ae527",
    ],

    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Light Blue", "Pale Pink", "Sage"],
    colorHex: ["#FFFFFF", "#ADD8E6", "#FFD1DC", "#9CAF88"],

    inStock: true,
    stockCount: 67,

    newArrival: false,
    isBestSeller: true,
    isTrending: false,

    rating: 4.7,
    reviewCount: 891,

    material: "Egyptian Cotton",
    fit: "Regular",

    tags: ["shirt", "cotton", "casual"],
  },

  {
    name: "Merino Crewneck Sweater",
    brand: "Chandu Premium",
    description:
      "A versatile layering essential made from the finest extra-fine Merino wool.",
    price: 2199,
    originalPrice: 3699,
    discount: 41,
    category: "men",
    gender: "Men",

    image:
      "https://images.unsplash.com/photo-1622497170185-5d668f816a56",
    images: [
      "https://images.unsplash.com/photo-1622497170185-5d668f816a56",
      "https://images.unsplash.com/photo-1630173250799-2813d34ed14b",
    ],

    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Navy", "Forest Green", "Burgundy", "Oatmeal"],
    colorHex: ["#000080", "#228B22", "#800020", "#E6DCC3"],

    inStock: true,
    stockCount: 28,

    newArrival: false,
    isBestSeller: false,
    isTrending: true,

    rating: 4.8,
    reviewCount: 234,

    material: "Merino Wool",
    fit: "Regular",

    tags: ["sweater", "merino", "winter"],
  },

  {
    name: "Kids' Cotton Puffer Jacket",
    brand: "Chandu Kids",
    description:
      "Keep the little ones warm and stylish with this lightweight puffer jacket.",
    price: 1499,
    originalPrice: 2499,
    discount: 40,
    category: "kids",
    gender: "Unisex",

    image:
      "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5",
    images: [
      "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5",
      "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd",
    ],

    sizes: ["2Y", "3Y", "4Y", "5Y", "6Y", "7Y", "8Y"],
    colors: ["Cobalt Blue", "Bubblegum Pink", "Forest Green"],
    colorHex: ["#0047AB", "#FF69B4", "#228B22"],

    inStock: true,
    stockCount: 37,

    newArrival: true,
    isBestSeller: false,
    isTrending: true,

    rating: 4.7,
    reviewCount: 203,

    material: "Cotton",
    fit: "Regular",

    tags: ["kids", "jacket", "winter"],
  },

  {
    name: "Organic Cotton Play Set",
    brand: "Chandu Kids",
    description:
      "A comfortable two-piece set crafted from GOTS-certified organic cotton.",
    price: 899,
    originalPrice: 1499,
    discount: 40,
    category: "kids",
    gender: "Unisex",

    image:
      "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd",
    images: [
      "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd",
      "https://images.unsplash.com/photo-1445205170230-053b83016050",
    ],

    sizes: ["1Y", "2Y", "3Y", "4Y", "5Y"],
    colors: ["Sunshine Yellow", "Mint", "Lilac"],
    colorHex: ["#FFD700", "#98FF98", "#C8A2C8"],

    inStock: true,
    stockCount: 52,

    newArrival: false,
    isBestSeller: true,
    isTrending: false,

    rating: 4.8,
    reviewCount: 341,

    material: "Organic Cotton",
    fit: "Regular",

    tags: ["kids", "playwear", "cotton"],
  },

  {
    name: "Pebbled Leather Tote Bag",
    brand: "Chandu Luxe",
    description:
      "An everyday essential elevated to an art form. Crafted from full-grain pebbled leather.",
    price: 4499,
    originalPrice: 7499,
    discount: 40,
    category: "accessories",
    gender: "Unisex",

    image:
      "https://images.unsplash.com/photo-1559563458-527698bf5295",
    images: [
      "https://images.unsplash.com/photo-1559563458-527698bf5295",
      "https://images.unsplash.com/photo-1575202332411-b01fe9ace7a8",
    ],

    sizes: ["One Size"],
    colors: ["Dove Grey", "Cognac", "Black"],
    colorHex: ["#696969", "#9A463D", "#000000"],

    inStock: true,
    stockCount: 19,

    newArrival: false,
    isBestSeller: true,
    isTrending: true,

    rating: 4.8,
    reviewCount: 267,

    material: "Full-Grain Leather",
    fit: "Structured",

    tags: ["bag", "leather", "accessories"],
  },

  {
    name: "Structured Crossbody Bag",
    brand: "Chandu Luxe",
    description:
      "The perfect go-anywhere bag with a detachable chain strap and gold-tone hardware.",
    price: 3299,
    originalPrice: 5499,
    discount: 40,
    category: "accessories",
    gender: "Unisex",

    image:
      "https://images.unsplash.com/photo-1591348278900-019a8a2a8b1d",
    images: [
      "https://images.unsplash.com/photo-1591348278900-019a8a2a8b1d",
      "https://images.unsplash.com/photo-1559563458-527698bf5295",
    ],

    sizes: ["One Size"],
    colors: ["Red", "Black", "Nude"],
    colorHex: ["#FF0000", "#000000", "#F2D2BD"],

    inStock: true,
    stockCount: 11,

    newArrival: true,
    isBestSeller: false,
    isTrending: true,

    rating: 4.7,
    reviewCount: 198,

    material: "Leather",
    fit: "Structured",

    tags: ["bag", "crossbody", "accessories"],
  },

  {
    name: "Silk Wrap Midi Dress",
    brand: "Chandu Luxe",
    description:
      "Our bestselling wrap dress returns in luxurious silk charmeuse. Perfect for evening events or elevated day wear.",
    price: 3299,
    originalPrice: 5499,
    discount: 40,
    category: "women",
    gender: "Women",

    image:
      "https://images.unsplash.com/photo-1533659828870-95ee305cee3e",
    images: [
      "https://images.unsplash.com/photo-1533659828870-95ee305cee3e",
      "https://images.unsplash.com/photo-1657373307141-349a3393d4d9",
      "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95",
    ],

    sizes: ["XS", "S", "M", "L"],
    colors: ["Black", "Deep Plum", "Midnight Navy"],
    colorHex: ["#000000", "#4E1F3A", "#191970"],

    inStock: true,
    stockCount: 15,

    newArrival: true,
    isBestSeller: true,
    isTrending: true,

    rating: 4.7,
    reviewCount: 189,

    material: "Silk Charmeuse",
    fit: "Regular",

    tags: ["dress", "silk", "evening"],
  },

  {
    name: "Tailored Wool Blazer",
    brand: "Chandu Premium",
    description:
      "Crafted from premium 100% wool, this structured blazer is the cornerstone of a sophisticated wardrobe.",
    price: 4999,
    originalPrice: 8499,
    discount: 41,
    category: "women",
    gender: "Women",

    image:
      "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95",
    images: [
      "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95",
      "https://images.unsplash.com/photo-1618244985759-a8a1dc26bce3",
      "https://images.unsplash.com/photo-1533659828870-95ee305cee3e",
    ],

    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Camel", "Black", "Ivory"],
    colorHex: ["#C19A6B", "#000000", "#FFFFF0"],

    inStock: true,
    stockCount: 24,

    newArrival: true,
    isBestSeller: true,
    isTrending: true,

    rating: 4.8,
    reviewCount: 312,

    material: "100% Wool",
    fit: "Tailored",

    tags: ["blazer", "formal", "premium"],
  },
];

// Seed database
async function seedProducts() {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("MongoDB connected");

    // Delete old products
    await Product.deleteMany({});

    console.log("Old products deleted");

    // Insert new products
    await Product.insertMany(products);

    console.log(`${products.length} products inserted successfully`);
  } catch (error) {
    console.error("❌ Error seeding products:");
    console.error(error.message);
  } finally {
    await mongoose.disconnect();

    console.log("MongoDB disconnected");
  }
}

seedProducts();