const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const FRONTEND_URL = process.env.FRONTEND_URL;

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(
  cors({
    origin: FRONTEND_URL || true,
    credentials: true,
  })
);

app.use(express.json());

// =====================================================
// DATABASE
// =====================================================

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is missing in .env file");
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully!");
  })
  .catch((error) => {
    console.error("❌ MongoDB connection failed:");
    console.error(error.message);
  });

// =====================================================
// USER SCHEMA
// =====================================================

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
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    avatar: {
      type: String,
      default: "",
    },

    googleId: {
      type: String,
      default: "",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

// =====================================================
// ADDRESS SCHEMA
// =====================================================

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["Home", "Work", "Other"],
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    additionalPhone: {
      type: String,
      default: "",
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    pincode: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Address = mongoose.model("Address", addressSchema);

// =====================================================
// PRODUCT SCHEMA
// =====================================================

const productSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    brand: {
      type: String,
      default: "StyleHub",
    },

    category: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      required: true,
    },

    originalPrice: {
      type: Number,
      default: 0,
    },

    image: {
      type: String,
      required: true,
    },

    images: {
      type: [String],
      default: [],
    },

    description: {
      type: String,
      default: "",
    },

    sizes: {
      type: [String],
      default: [],
    },

    colors: {
      type: [String],
      default: [],
    },

    isBestSeller: {
      type: Boolean,
      default: false,
    },

    newArrival: {
      type: Boolean,
      default: false,
    },

    rating: {
      type: Number,
      default: 4.5,
    },

    reviewCount: {
      type: Number,
      default: 0,
    },

    inStock: {
      type: Boolean,
      default: true,
    },

    stockCount: {
      type: Number,
      default: 0,
    },

    material: {
      type: String,
      default: "",
    },

    fit: {
      type: String,
      default: "",
    },

    gender: {
      type: String,
      default: "",
    },

    discount: {
      type: Number,
      default: 0,
    },

    tags: {
      type: [String],
      default: [],
    },

    isNew: {
      type: Boolean,
      default: false,
    },

    isTrending: {
      type: Boolean,
      default: false,
    },

    sku: {
      type: String,
      default: "",
    },

    subcategory: {
      type: String,
      default: "",
    },

    careInstructions: {
      type: String,
      default: "",
    },

    occasion: {
      type: String,
      default: "",
    },

    countryOfOrigin: {
      type: String,
      default: "India",
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

// =====================================================
// HOME
// =====================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "StyleHub backend is running!",
  });
});

// =====================================================
// GET ALL PRODUCTS
// =====================================================

app.get("/api/products", async (req, res) => {
  try {
    console.log("📦 GET /api/products");

    const products = await Product.find({})
      .sort({ createdAt: -1 })
      .lean();

    console.log(`✅ Products found: ${products.length}`);

    const normalizedProducts = products.map((product) => ({
      ...product,
      id: product.id || product._id?.toString(),
      images:
        Array.isArray(product.images) && product.images.length > 0
          ? product.images
          : product.image
          ? [product.image]
          : [],
      inStock: product.inStock !== false,
      stockCount: Number(product.stockCount || 0),
      discount: Number(product.discount || 0),
      reviewCount: Number(
        product.reviewCount ??
          (typeof product.reviews === "number" ? product.reviews : 0)
      ),
      reviews: Array.isArray(product.reviews) ? product.reviews : [],
    }));

    return res.status(200).json({
      success: true,
      products: normalizedProducts,
    });
  } catch (error) {
    console.error("❌ PRODUCTS ERROR:");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to load products.",
      error: error.message,
    });
  }
});

// =====================================================
// GET PRODUCT BY ID
// =====================================================

app.get("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({
      $or: [
        { id: id },
        ...(mongoose.Types.ObjectId.isValid(id)
          ? [{ _id: id }]
          : []),
      ],
    }).lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const normalizedProduct = {
      ...product,
      id: product.id || product._id?.toString(),
      images:
        Array.isArray(product.images) && product.images.length > 0
          ? product.images
          : product.image
          ? [product.image]
          : [],
      inStock: product.inStock !== false,
      stockCount: Number(product.stockCount || 0),
      discount: Number(product.discount || 0),
      reviewCount: Number(
        product.reviewCount ??
          (typeof product.reviews === "number"
            ? product.reviews
            : 0)
      ),
      reviews: Array.isArray(product.reviews)
        ? product.reviews
        : [],
    };

    return res.status(200).json({
      success: true,
      product: normalizedProduct,
    });
  } catch (error) {
    console.error("❌ PRODUCT BY ID ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load product.",
      error: error.message,
    });
  }
});

// =====================================================
// REGISTER
// =====================================================

app.post("/api/users/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone = "",
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: cleanEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      phone: phone.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful.",
      user: {
        id: user._id.toString(),
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        avatar: user.avatar || "",
      },
    });
  } catch (error) {
    console.error("❌ Registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during registration.",
      error: error.message,
    });
  }
});

// =====================================================
// LOGIN
// =====================================================

app.post("/api/users/login", async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: cleanEmail,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      user: {
        id: user._id.toString(),
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        avatar: user.avatar || "",
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during login.",
      error: error.message,
    });
  }
});

// =====================================================
// GOOGLE LOGIN / SIGN UP
// =====================================================

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

app.post("/api/users/google-login", async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential is missing.",
      });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({
        success: false,
        message: "GOOGLE_CLIENT_ID is missing in backend .env.",
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email || !payload.sub) {
      return res.status(401).json({
        success: false,
        message: "Invalid Google account information.",
      });
    }

    const email = payload.email.trim().toLowerCase();
    const googleId = payload.sub;
    const name =
      payload.name ||
      payload.given_name ||
      "StyleHub User";
    const avatar = payload.picture || "";

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        password: "",
        phone: "",
        avatar,
        googleId,
      });

      console.log("✅ Google account created:", email);
    } else {
      user.googleId = googleId;
      if (avatar) user.avatar = avatar;
      if (!user.name) user.name = name;
      await user.save();

      console.log("✅ Google account logged in:", email);
    }

    return res.status(200).json({
      success: true,
      message: "Google login successful.",
      user: {
        id: user._id.toString(),
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        avatar: user.avatar || "",
      },
    });
  } catch (error) {
    console.error("❌ Google login error:", error);

    return res.status(401).json({
      success: false,
      message: "Google authentication failed. Please try again.",
      error: error.message,
    });
  }
});

// =====================================================
// GET USER
// =====================================================

app.get("/api/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    const user = await User.findById(userId).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.json({
      success: true,
      user: {
        id: user._id.toString(),
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        avatar: user.avatar || "",
      },
    });
  } catch (error) {
    console.error("❌ Get user error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get user.",
    });
  }
});

// =====================================================
// GET ADDRESSES
// =====================================================

app.get(
  "/api/users/:userId/addresses",
  async (req, res) => {
    try {
      const { userId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID.",
        });
      }

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      const addresses = await Address.find({
        userId,
      }).sort({
        createdAt: -1,
      });

      return res.status(200).json({
        success: true,
        addresses,
      });
    } catch (error) {
      console.error("❌ Get addresses error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to load saved addresses.",
        error: error.message,
      });
    }
  }
);

// =====================================================
// SAVE / UPDATE ADDRESS
// =====================================================

app.post(
  "/api/users/:userId/addresses",
  async (req, res) => {
    try {
      const { userId } = req.params;

      const {
        type,
        name,
        phone,
        additionalPhone = "",
        address,
        city,
        state,
        pincode,
      } = req.body;

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID. Please login again.",
        });
      }

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found. Please login again.",
        });
      }

      if (
        !type ||
        !name ||
        !phone ||
        !address ||
        !city ||
        !state ||
        !pincode
      ) {
        return res.status(400).json({
          success: false,
          message:
            "All required address fields must be provided.",
        });
      }

      if (!["Home", "Work", "Other"].includes(type)) {
        return res.status(400).json({
          success: false,
          message:
            "Address type must be Home, Work or Other.",
        });
      }

      if (!/^\d{10}$/.test(phone)) {
        return res.status(400).json({
          success: false,
          message:
            "Phone number must contain 10 digits.",
        });
      }

      if (
        additionalPhone &&
        !/^\d{10}$/.test(additionalPhone)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Additional phone number must contain 10 digits.",
        });
      }

      if (!/^\d{6}$/.test(pincode)) {
        return res.status(400).json({
          success: false,
          message:
            "Pincode must contain 6 digits.",
        });
      }

      let savedAddress = await Address.findOne({
        userId,
        type,
      });

      if (savedAddress) {
        savedAddress.name = name.trim();
        savedAddress.phone = phone.trim();
        savedAddress.additionalPhone =
          additionalPhone.trim();
        savedAddress.address = address.trim();
        savedAddress.city = city.trim();
        savedAddress.state = state.trim();
        savedAddress.pincode = pincode.trim();

        savedAddress = await savedAddress.save();
      } else {
        savedAddress = await Address.create({
          userId,
          type,
          name: name.trim(),
          phone: phone.trim(),
          additionalPhone:
            additionalPhone.trim(),
          address: address.trim(),
          city: city.trim(),
          state: state.trim(),
          pincode: pincode.trim(),
        });
      }

      return res.status(200).json({
        success: true,
        message: `${type} address saved successfully!`,
        address: savedAddress,
      });
    } catch (error) {
      console.error("❌ Save address error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to save address.",
        error: error.message,
      });
    }
  }
);

// =====================================================
// DELETE ADDRESS
// =====================================================

app.delete(
  "/api/addresses/:addressId",
  async (req, res) => {
    try {
      const { addressId } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(addressId)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid address ID.",
        });
      }

      const deletedAddress =
        await Address.findByIdAndDelete(addressId);

      if (!deletedAddress) {
        return res.status(404).json({
          success: false,
          message: "Address not found.",
        });
      }

      return res.json({
        success: true,
        message: "Address deleted successfully.",
      });
    } catch (error) {
      console.error("❌ Delete address error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to delete address.",
      });
    }
  }
);

// =====================================================
// 404
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// =====================================================
// ERROR HANDLER
// =====================================================

app.use((error, req, res, next) => {
  console.error("❌ UNHANDLED SERVER ERROR:", error);

  res.status(500).json({
    success: false,
    message: "Internal server error.",
    error: error.message,
  });
});

// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, () => {
  console.log(
    `🚀 StyleHub backend running on http://localhost:${PORT}`
  );
});