const mongoose = require("mongoose");

const salonSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isApproved: {
      type: Boolean,
      default: false,
    },

    // Working Hours
    workingHours: {
      start: {
        type: String,
        default: "09:00",
      },
      end: {
        type: String,
        default: "18:00",
      },
    },

    // Slot Duration (in minutes)
    slotDuration: {
      type: Number,
      default: 30,
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
  },
  { timestamps: true }
);

salonSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Salon", salonSchema);