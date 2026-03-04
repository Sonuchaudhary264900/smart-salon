const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const Service = require("../models/Service");
const Salon = require("../models/Salon");

// ===============================
// ADD SERVICE (Owner)
// ===============================
router.post("/add", requireAuth, async (req, res) => {
  try {
    const { name, price, duration } = req.body;

    const salon = await Salon.findOne({
      ownerId: req.user._id,
    });

    if (!salon) {
      return res.status(404).json({
        message: "Salon not found",
      });
    }

    const service = await Service.create({
      name,
      price,
      duration,
      salonId: salon._id,
    });

    res.status(201).json(service);

  } catch (error) {
    res.status(500).json({
      message: "Error adding service",
    });
  }
});

// ===============================
// GET SERVICES BY SALON
// ===============================
router.get("/salon/:salonId", async (req, res) => {
  try {
    const services = await Service.find({
      salonId: req.params.salonId,
    });

    res.json(services);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching services",
    });
  }
});

// ===============================
// DELETE SERVICE
// ===============================
router.delete("/delete/:id", requireAuth, async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: "Service deleted" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting service",
    });
  }
});

module.exports = router;