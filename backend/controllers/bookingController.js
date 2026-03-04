const Booking = require("../models/Booking");
const Salon = require("../models/Salon");
const Service = require("../models/Service");

// ================= SLOT GENERATION =================
exports.getAvailableSlots = async (req, res) => {
  try {
    const { salonId, date } = req.query;

    const salon = await Salon.findById(salonId);
    if (!salon) return res.status(404).json({ message: "Salon not found" });

    const openHour = parseInt(salon.openTime.split(":")[0]);
    const closeHour = parseInt(salon.closeTime.split(":")[0]);

    let slots = [];

    for (let hour = openHour; hour < closeHour; hour++) {
      slots.push(`${hour}:00`);
      slots.push(`${hour}:30`);
    }

    const bookedSlots = await Booking.find({
      salonId,
      date,
    }).select("time");

    const bookedTimes = bookedSlots.map(b => b.time);

    const availableSlots = slots.map(slot => ({
      time: slot,
      booked: bookedTimes.includes(slot)
    }));

    res.json(availableSlots);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ================= CREATE BOOKING =================


exports.createBooking = async (req, res) => {
  try {
    const { salonId, serviceId, date, time } = req.body;

    const salon = await Salon.findById(salonId);
    if (new Date(date) < new Date().setHours(0,0,0,0)) {
  return res.status(400).json({ message: "Cannot book past dates" });
}
    if (!salon || !salon.isApproved)
      return res.status(400).json({ message: "Salon not available" });

    const service = await Service.findById(serviceId);
    if (!service)
      return res.status(404).json({ message: "Service not found" });

    // Collision check
    const existing = await Booking.findOne({
      salonId,
      date,
      time,
      status: { $in: ["pending", "confirmed"] }
    });

    if (existing)
      return res.status(400).json({ message: "Slot already booked" });

    const booking = await Booking.create({
      userId: req.user._id,
      salonId,
      serviceId,
      date,
      time,
      status: "pending"
    });

    res.status(201).json({
      message: "Booking created. Waiting for confirmation.",
      booking
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ================= USER BOOKINGS =================
exports.getUserBookings = async (req, res) => {
  const bookings = await Booking.find({ userId: req.user._id })
    .populate("salonId serviceId");

  res.json(bookings);
};

// ================= OWNER BOOKINGS =================
exports.getOwnerBookings = async (req, res) => {
  const salon = await Salon.findOne({ ownerId: req.user._id });

  if (!salon)
    return res.status(404).json({ message: "Salon not found" });

  const bookings = await Booking.find({ salonId: salon._id })
    .populate("userId serviceId");

  res.json(bookings);
};

// ================= OWNER STATUS UPDATE =================
exports.ownerUpdateBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking)
    return res.status(404).json({ message: "Booking not found" });

  const salon = await Salon.findOne({
    _id: booking.salonId,
    ownerId: req.user._id
  });

  if (!salon)
    return res.status(403).json({ message: "Not authorized" });

  const { status } = req.body;

  const allowedTransitions = {
    pending: ["confirmed", "cancelled"],
    confirmed: ["completed"]
  };

  if (!allowedTransitions[booking.status]?.includes(status)) {
    return res.status(400).json({ message: "Invalid status transition" });
  }

  booking.status = status;
  await booking.save();

  res.json({ message: "Booking updated", booking });
};