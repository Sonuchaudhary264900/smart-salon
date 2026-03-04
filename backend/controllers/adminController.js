const Salon = require("../models/Salon");
const User = require("../models/user");

// =================== GET PENDING SALONS ===================
exports.getPendingSalons = async (req, res) => {
  try {
    const salons = await Salon.find({ isApproved: false })
      .populate("ownerId", "name phone");

    res.json(salons);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// =================== APPROVE SALON ===================
exports.approveSalon = async (req, res) => {
  try {
    const salon = await Salon.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );

    if (!salon) {
      return res.status(404).json({ message: "Salon not found" });
    }

    res.json({ message: "Salon approved", salon });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// =================== REJECT SALON ===================
exports.rejectSalon = async (req, res) => {
  try {
    const salon = await Salon.findByIdAndDelete(req.params.id);

    if (!salon) {
      return res.status(404).json({ message: "Salon not found" });
    }

    res.json({ message: "Salon rejected and removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// =================== BLOCK USER OR OWNER ===================
exports.blockUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If owner blocked → hide their salon
    if (user.role === "owner") {
      await Salon.updateMany(
        { ownerId: user._id },
        { isApproved: false }
      );
    }

    res.json({ message: "User blocked", user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// =================== UNBLOCK USER ===================
exports.unblockUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User unblocked", user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
const Booking = require("../models/Booking");

// =================== GET ALL BOOKINGS ===================
exports.getAllBookings = async (req, res) => {
  try {
    const { date, salonId } = req.query;

    let filter = {};

    if (date) {
      filter.date = date;
    }

    if (salonId) {
      filter.salonId = salonId;
    }

    const bookings = await Booking.find(filter)
      .populate("userId", "name phone")
      .populate("salonId", "name address")
      .populate("serviceId", "name price duration")
      .sort({ createdAt: -1 });

    res.json(bookings);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};