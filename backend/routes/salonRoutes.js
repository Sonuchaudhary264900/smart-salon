const express = require("express");
const router = express.Router();

const Salon = require("../models/Salon");
const requireAuth = require("../middleware/requireAuth");


// ===============================
// CREATE SALON (OWNER)
// ===============================
router.post("/create", requireAuth, async (req, res) => {
  try {

    const { name, address, lat, lng } = req.body;

    const salon = await Salon.create({
      name,
      address,
      ownerId: req.user._id,

      location: {
        type: "Point",
        coordinates: [lng, lat]
      },

      isApproved: false
    });

    res.json(salon);

  } catch (error) {
    res.status(500).json({
      message: "Error creating salon"
    });
  }
});
 // ===============================
// TRENDING SALONS (MOST BOOKINGS)
// ===============================
router.get("/trending", async (req, res) => {
  try {

    const Booking = require("../models/Booking");

    // get bookings from last 7 days
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const trending = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: lastWeek },
          status: { $in: ["confirmed", "completed"] }
        }
      },
      {
        $group: {
          _id: "$salonId",
          totalBookings: { $sum: 1 }
        }
      },
      {
        $sort: { totalBookings: -1 }
      },
      {
        $limit: 10
      }
    ]);

    const salonIds = trending.map(t => t._id);

    const salons = await Salon.find({
      _id: { $in: salonIds },
      isApproved: true
    });

    res.json(salons);

  } catch (error) {

    res.status(500).json({
      message: "Error fetching trending salons"
    });

  }
});

// ===============================
// GET OWNER SALON
// ===============================
router.get("/owner-salon", requireAuth, async (req, res) => {

  try {

    const salon = await Salon.findOne({
      ownerId: req.user._id
    });

    res.json(salon);

  } catch (error) {

    res.status(500).json({
      message: "Error fetching salon"
    });

  }

});


// ===============================
// UPDATE WORKING HOURS
// ===============================
router.put("/update-hours", requireAuth, async (req, res) => {

  try {

    const { start, end, slotDuration } = req.body;

    const salon = await Salon.findOne({
      ownerId: req.user._id
    });

    if (!salon) {
      return res.status(404).json({
        message: "Salon not found"
      });
    }

    salon.workingHours.start = start;
    salon.workingHours.end = end;
    salon.slotDuration = slotDuration;

    await salon.save();

    res.json({
      message: "Working hours updated",
      salon
    });

  } catch (error) {

    res.status(500).json({
      message: "Error updating working hours"
    });

  }

});


// ===============================
// GET NEARBY SALONS (TOP RATED FIRST)
// ===============================
router.get("/nearby", async (req, res) => {

  try {

    const { lat, lng } = req.query;

    const salons = await Salon.find({
      isApproved: true
    })
      .sort({ averageRating: -1, totalReviews: -1 }) // TOP RATED FIRST
      .limit(50);

    res.json(salons);

  } catch (error) {

    res.status(500).json({
      message: "Error fetching salons"
    });

  }

});


// ===============================
// GET SALON BY ID
// ===============================
router.get("/:id", async (req, res) => {

  try {

    const salon = await Salon.findById(req.params.id);

    res.json(salon);

  } catch (error) {

    res.status(500).json({
      message: "Error fetching salon"
    });

  }

});



module.exports = router;