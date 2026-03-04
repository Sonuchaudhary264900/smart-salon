const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const Booking = require("../models/Booking");
const Salon = require("../models/Salon");

// CREATE BOOKING
router.post("/create", requireAuth, async (req, res) => {
  try {
    const { salonId, serviceId, date, time } = req.body;
    const Service = require("../models/Service");
const service = await Service.findById(serviceId);

   const booking = await Booking.create({
  userId: req.user._id,
  salonId,
  serviceId,
  date,
  time,
  price: service.price,
  status: "pending",
});

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Error creating booking" });
  }
});
// ===============================
// GET AVAILABLE SLOTS
// ===============================
router.get("/available-slots", async (req, res) => {
  try {
    const { salonId, date } = req.query;

    if (!salonId || !date) {
      return res.status(400).json({
        message: "Salon ID and date required",
      });
    }

    const Salon = require("../models/Salon");

    const salon = await Salon.findById(salonId);

    if (!salon) {
      return res.status(404).json({
        message: "Salon not found",
      });
    }

    const { start, end } = salon.workingHours;
    const slotDuration = salon.slotDuration;

    // Convert time to minutes
    const timeToMinutes = (time) => {
      const [h, m] = time.split(":").map(Number);
      return h * 60 + m;
    };

    const minutesToTime = (minutes) => {
      const h = Math.floor(minutes / 60);
      const m = minutes % 60;
      return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    };

    let startMinutes = timeToMinutes(start);
    const endMinutes = timeToMinutes(end);

    let allSlots = [];

    while (startMinutes + slotDuration <= endMinutes) {
      allSlots.push(minutesToTime(startMinutes));
      startMinutes += slotDuration;
    }

    // Find booked slots
    const booked = await Booking.find({
      salonId,
      date,
    });

    const bookedTimes = booked.map((b) => b.time);

    const availableSlots = allSlots.filter(
      (slot) => !bookedTimes.includes(slot)
    );

    res.json(availableSlots);

  } catch (error) {
    res.status(500).json({
      message: "Error generating slots",
    });
  }
});

// GET OWNER BOOKINGS
router.get("/owner-bookings", requireAuth, async (req, res) => {
  try {
    const salon = await Salon.findOne({
      ownerId: req.user._id,
    });

    if (!salon) {
      return res.status(404).json({
        message: "No salon found",
      });
    }

    const bookings = await Booking.find({
      salonId: salon._id,
    })
      .populate("userId", "name phone")
      .populate("serviceId", "name");

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings" });
  }
});

// UPDATE BOOKING STATUS
router.put("/update/:id", requireAuth, async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    booking.status = status;
    await booking.save();

    res.json({ message: "Booking updated" });
  } catch (error) {
    res.status(500).json({ message: "Error updating booking" });
  }
});
// ===============================
// ADD OFFLINE BOOKING (Owner)
// ===============================
router.post("/offline", requireAuth, async (req, res) => {
  try {
    const { customerName, customerPhone, serviceId, date, time } = req.body;

    const salon = await require("../models/Salon").findOne({
      ownerId: req.user._id,
    });

    if (!salon) {
      return res.status(404).json({
        message: "Salon not found",
      });
    }

    // Prevent double booking
    const existing = await Booking.findOne({
      salonId: salon._id,
      date,
      time,
    });

    if (existing) {
      return res.status(400).json({
        message: "Slot already booked",
      });
    }
    const Service = require("../models/Service");
const service = await Service.findById(serviceId);

   const booking = await Booking.create({
  customerName,
  customerPhone,
  salonId: salon._id,
  serviceId,
  date,
  time,
  price: service.price,
  bookingType: "offline",
  status: "confirmed",
});
    res.status(201).json(booking);

  } catch (error) {
    res.status(500).json({
      message: "Error creating offline booking",
    });
  }
});
// ===============================
// OWNER ANALYTICS
// ===============================
router.get("/owner-analytics", requireAuth, async (req, res) => {
  try {
    const Salon = require("../models/Salon");

    const salon = await Salon.findOne({
      ownerId: req.user._id,
    });

    if (!salon) {
      return res.status(404).json({ message: "Salon not found" });
    }

    const today = new Date().toISOString().split("T")[0];
    const month = today.substring(0, 7);

    const bookings = await Booking.find({
      salonId: salon._id,
    });

    const todayBookings = bookings.filter(b => b.date === today);
    const monthBookings = bookings.filter(b =>
      b.date.startsWith(month)
    );

    const totalBookingsToday = todayBookings.length;

    const totalRevenueToday = todayBookings
      .filter(b => b.status === "completed")
      .reduce((sum, b) => sum + b.price, 0);

    const totalRevenueMonth = monthBookings
      .filter(b => b.status === "completed")
      .reduce((sum, b) => sum + b.price, 0);

    const totalCompleted = bookings.filter(
      b => b.status === "completed"
    ).length;

    const totalCancelled = bookings.filter(
      b => b.status === "cancelled"
    ).length;

    res.json({
      totalBookingsToday,
      totalRevenueToday,
      totalRevenueMonth,
      totalCompleted,
      totalCancelled,
    });

  } catch (error) {
    res.status(500).json({ message: "Analytics error" });
  }
});
module.exports = router;