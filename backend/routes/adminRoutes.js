const express = require("express");
const router = express.Router();

const requireAdmin = require("../middleware/requireAdmin");
const Salon = require("../models/Salon");

// ===============================
// GET ALL SALONS
// ===============================
router.get("/salons", requireAdmin, async (req, res) => {
  try {
    const salons = await Salon.find().populate("ownerId", "name phone");
    res.json(salons);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ===============================
// APPROVE SALON
// ===============================
router.put("/approve/:id", requireAdmin, async (req, res) => {
  try {
    const salon = await Salon.findById(req.params.id);

    if (!salon) {
      return res.status(404).json({ message: "Salon not found" });
    }

    salon.isApproved = true;
    await salon.save();

    res.json({ message: "Salon approved successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;