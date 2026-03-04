const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// =======================
// IMPORT ROUTES
// =======================
const serviceRoutes = require("./routes/serviceRoutes");
const authRoutes = require("./routes/authRoutes");
const salonRoutes = require("./routes/salonRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// =======================
// MIDDLEWARES
// =======================
app.use(cors());
app.use(express.json());

// =======================
// ROUTES
// =======================

// Authentication
app.use("/api/auth", authRoutes);

// Salon routes
app.use("/api/salons", salonRoutes);

// Service routes
app.use("/api/services", serviceRoutes);

// Booking routes
app.use("/api/bookings", bookingRoutes);

// Admin routes
app.use("/api/admin", adminRoutes);

// Root test route
app.get("/", (req, res) => {
  res.send("SmartSalon API is running...");
});

// =======================
// DATABASE CONNECTION
// =======================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });

// =======================
// GLOBAL ERROR HANDLER
// =======================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
  });
});