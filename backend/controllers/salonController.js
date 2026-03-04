const Salon = require("../models/Salon");

// ===============================
// CREATE SALON (Owner Only)
// ===============================
exports.createSalon = async (req, res) => {
  try {
    const { name, address } = req.body;

    if (!name || !address) {
      return res.status(400).json({
        message: "Name and address are required",
      });
    }

    // Check if owner already has salon
    const existingSalon = await Salon.findOne({
      ownerId: req.user._id,
    });

    if (existingSalon) {
      return res.status(400).json({
        message: "You already have a registered salon",
      });
    }

    const salon = await Salon.create({
      name,
      address,
      ownerId: req.user._id,
      isApproved: false, // admin must approve
    });

    res.status(201).json(salon);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error while creating salon",
    });
  }
};

// ===============================
// GET OWNER SALON
// ===============================
exports.getOwnerSalon = async (req, res) => {
  try {
    const salon = await Salon.findOne({
      ownerId: req.user._id,
    });

    if (!salon) {
      return res.status(404).json({
        message: "No salon found for this owner",
      });
    }

    res.json(salon);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error while fetching salon",
    });
  }
};