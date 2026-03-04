const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // not required for offline
    },

    customerName: {
      type: String,
    },

    customerPhone: {
      type: String,
    },

    salonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Salon",
      required: true,
    },

    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    price: {
  type: Number,
  required: true,
},

    date: {
      type: String,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      default: "pending",
    },

    bookingType: {
      type: String,
      enum: ["online", "offline"],
      default: "online",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);