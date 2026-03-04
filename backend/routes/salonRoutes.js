const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");

const {
  createSalon,
  getOwnerSalon,
} = require("../controllers/salonController");

// ===============================
// OWNER ROUTES
// ===============================

// Create Salon
router.post("/create", requireAuth, createSalon);

// Get Owner Salon
router.get("/owner-salon", requireAuth, getOwnerSalon);
// ===============================
// UPDATE WORKING HOURS (Owner)
// ===============================
router.put("/update-hours", requireAuth, async (req, res) => {
  try {
    const { start, end, slotDuration } = req.body;

    const salon = await require("../models/Salon").findOne({
      ownerId: req.user._id,
    });

    if (!salon) {
      return res.status(404).json({
        message: "Salon not found",
      });
    }

    salon.workingHours.start = start;
    salon.workingHours.end = end;
    salon.slotDuration = slotDuration;

    await salon.save();

    res.json({
      message: "Working hours updated",
      salon,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error updating working hours",
    });
  }
});

module.exports = router;