const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Simple in-memory OTP store
// (For production, use Redis or database)
const otpStore = {};

// =======================
// SEND OTP
// =======================
exports.sendOTP = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        message: "Phone number is required",
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP
    otpStore[phone] = otp;

    console.log(`OTP for ${phone}: ${otp}`);

    // In real production, send SMS here

    res.json({
      message: "OTP sent successfully",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error while sending OTP",
    });
  }
};

// =======================
// VERIFY OTP
// =======================
exports.verifyOTP = async (req, res) => {
  try {
    const { name, phone, otp, role } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        message: "Phone and OTP are required",
      });
    }

    // Check OTP
    if (!otpStore[phone] || otpStore[phone] !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // Remove OTP after use
    delete otpStore[phone];

    // Find existing user
    let user = await User.findOne({ phone });

    if (!user) {
      // Create new user
      user = await User.create({
        name: name || "User",
        phone,
        role: role || "user",
      });
    } else {
      // 🔥 IMPORTANT FIX
      // Allow role update if user selects different role
      if (role && user.role !== role) {
        user.role = role;
        await user.save();
      }
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error during OTP verification",
    });
  }
};