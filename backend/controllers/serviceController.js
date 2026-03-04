const Service = require("../models/Service");
const Salon = require("../models/Salon");

// ================= ADD SERVICE =================
exports.addService = async (req, res) => {
  try {
    const { salonId, name, price, duration } = req.body;

    const salon = await Salon.findOne({
      _id: salonId,
      ownerId: req.user._id
    });

    if (!salon) {
      return res.status(403).json({ message: "Not your salon" });
    }

    const service = await Service.create({
      salonId,
      name,
      price,
      duration
    });

    res.status(201).json(service);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ================= UPDATE SERVICE =================
exports.updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const salon = await Salon.findOne({
      _id: service.salonId,
      ownerId: req.user._id
    });

    if (!salon) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updated = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ================= DELETE SERVICE =================
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const salon = await Salon.findOne({
      _id: service.salonId,
      ownerId: req.user._id
    });

    if (!salon) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Service.findByIdAndDelete(req.params.id);

    res.json({ message: "Service deleted" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ================= GET SALON SERVICES =================
exports.getSalonServices = async (req, res) => {
  try {
    const services = await Service.find({
      salonId: req.params.salonId
    });

    res.json(services);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};