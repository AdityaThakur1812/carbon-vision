const DailyActivity = require("../models/DailyActivity");
const { calculateCO2 } = require("../utils/carbonCalculator");

/* ================= LOG / UPDATE TODAY ================= */

exports.logActivity = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;
    const date = new Date().toISOString().slice(0, 10);

    // Normalize incoming data (very important)
    const activityData = {
      transport: req.body.transport || "Walk",
      vehicleDistance: Number(req.body.vehicleDistance || 0),
      airTravelFreq: req.body.airTravelFreq || "None",

      diet: req.body.diet || "Vegetarian",

      energyEfficiency: req.body.energyEfficiency || "Medium",
      tvPcHours: Number(req.body.tvPcHours || 0),
      internetHours: Number(req.body.internetHours || 0),

      wasteBagWeekly: Number(req.body.wasteBagWeekly || 0),
    };

    // Calculate carbon footprint
    const carbonPoints = calculateCO2(activityData);

    const entry = await DailyActivity.findOneAndUpdate(
      { userId, date },
      {
        userId,
        date,
        ...activityData,
        carbonPoints
      },
      { new: true, upsert: true }
    );

    res.json(entry);
  } catch (error) {
    console.error("Activity log error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET TODAY ================= */

exports.getToday = async (req, res) => {
  try {
    const userId = req.user.id;
    const date = new Date().toISOString().slice(0, 10);

    const entry = await DailyActivity.findOne({ userId, date });
    res.json(entry || null);
  } catch (error) {
    console.error("Get today error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= HISTORY ================= */

exports.getHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const list = await DailyActivity
      .find({ userId })
      .sort({ date: 1 });

    res.json(list);
  } catch (error) {
    console.error("History error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
