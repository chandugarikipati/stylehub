const express = require("express");
const mongoose = require("mongoose");

const Address = require("../models/Address");
const User = require("../models/User");

const router = express.Router();

// =====================================================
// GET SAVED ADDRESSES
// GET /api/users/:userId/addresses
// =====================================================

router.get(
  "/users/:userId/addresses",
  async (req, res) => {
    try {
      const { userId } = req.params;

      console.log(
        "GET addresses for user:",
        userId
      );

      if (
        !mongoose.Types.ObjectId.isValid(
          userId
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid user ID.",
        });
      }

      const user =
        await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          message:
            "User not found.",
        });
      }

      const addresses =
        await Address.find({
          userId,
        }).sort({
          createdAt: -1,
        });

      return res.status(200).json({
        addresses,
      });
    } catch (error) {
      console.error(
        "GET addresses error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to load addresses.",
        error:
          error.message,
      });
    }
  }
);

// =====================================================
// SAVE ADDRESS
// POST /api/users/:userId/addresses
// =====================================================

router.post(
  "/users/:userId/addresses",
  async (req, res) => {
    try {
      const { userId } = req.params;

      console.log(
        "POST address for user:",
        userId
      );

      console.log(
        "Address received:",
        req.body
      );

      if (
        !mongoose.Types.ObjectId.isValid(
          userId
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid user ID.",
        });
      }

      const user =
        await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          message:
            "User not found.",
        });
      }

      const {
        type,
        name,
        phone,
        additionalPhone,
        address,
        city,
        state,
        pincode,
      } = req.body;

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
          message:
            "Please provide all required address fields.",
        });
      }

      // =================================================
      // One Home, one Work, one Other per user.
      // If it already exists, update it.
      // =================================================

      const savedAddress =
        await Address.findOneAndUpdate(
          {
            userId,
            type,
          },
          {
            userId,
            type,
            name,
            phone,
            additionalPhone:
              additionalPhone || "",
            address,
            city,
            state,
            pincode,
          },
          {
            new: true,
            upsert: true,
            runValidators: true,
            setDefaultsOnInsert: true,
          }
        );

      console.log(
        "Address saved:",
        savedAddress
      );

      return res.status(200).json({
        message:
          `${type} address saved successfully!`,
        address:
          savedAddress,
      });
    } catch (error) {
      console.error(
        "POST address error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to save address.",
        error:
          error.message,
      });
    }
  }
);

// =====================================================
// DELETE ADDRESS
// DELETE /api/users/:userId/addresses/:type
// =====================================================

router.delete(
  "/users/:userId/addresses/:type",
  async (req, res) => {
    try {
      const {
        userId,
        type,
      } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          userId
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid user ID.",
        });
      }

      await Address.findOneAndDelete({
        userId,
        type,
      });

      return res.status(200).json({
        message:
          `${type} address deleted successfully.`,
      });
    } catch (error) {
      console.error(
        "DELETE address error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to delete address.",
      });
    }
  }
);

module.exports = router;