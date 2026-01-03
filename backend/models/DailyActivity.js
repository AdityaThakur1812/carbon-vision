const mongoose = require("mongoose");

const DailyActivitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    date: {
      type: String, // YYYY-MM-DD
      required: true,
      index: true
    },

    /* ================= TRANSPORT ================= */
    transport: {
      type: String,
      enum: ["Car", "Public", "Bike", "Walk"],
      default: "Walk"
    },

    vehicleDistance: {
      type: Number,
      default: 0,
      min: 0
    },

    airTravelFreq: {
      type: String,
      enum: ["None", "Rare", "Frequent"],
      default: "None"
    },

    /* ================= FOOD ================= */
    diet: {
      type: String,
      enum: ["Vegan", "Vegetarian", "Omnivore"],
      default: "Vegetarian"
    },

    /* ================= ENERGY ================= */
    energyEfficiency: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium"
    },

    tvPcHours: {
      type: Number,
      default: 0,
      min: 0
    },

    internetHours: {
      type: Number,
      default: 0,
      min: 0
    },

    /* ================= WASTE ================= */
    wasteBagWeekly: {
      type: Number,
      default: 0,
      min: 0
    },

    /* ================= RESULT ================= */
    carbonPoints: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);

/* Prevent duplicate logs per day */
DailyActivitySchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("DailyActivity", DailyActivitySchema);
