const User = require("../models/User");
const DailyActivity = require("../models/DailyActivity");

/* ======================
   GET CURRENT USER
====================== */
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("getMe error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ======================
   GET PROFILE + STATS
====================== */
exports.getProfile = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;

    /* ---- USER INFO ---- */
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    /* ---- ACTIVITY DATA ---- */
    const activities = await DailyActivity.find({ userId });

    const daysTracked = activities.length;

    let totalCarbon = 0;
    let bestDay = null;
    let worstDay = null;

    activities.forEach((a) => {
      const c = Number(a.carbonPoints || 0);
      totalCarbon += c;
      bestDay = bestDay === null ? c : Math.min(bestDay, c);
      worstDay = worstDay === null ? c : Math.max(worstDay, c);
    });

    const avgCarbon =
      daysTracked > 0
        ? Number((totalCarbon / daysTracked).toFixed(2))
        : 0;

    /* ---- BADGE LOGIC ---- */
    let badge = "Eco Beginner 🌱";
    if (avgCarbon > 0 && avgCarbon < 5) badge = "Climate Hero 🌳";
    else if (avgCarbon < 10) badge = "Conscious User 🌿";

    /* ---- INSIGHT ---- */
    let insight = "Start logging daily activity to see insights.";
    if (daysTracked >= 5) {
      insight =
        avgCarbon < 8
          ? "Great job! Your lifestyle choices are eco-friendly."
          : "Transport and food choices are contributing most to your emissions.";
    }

    /* ---- ACCOUNT AGE ---- */
    const joinedDays = Math.floor(
      (Date.now() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)
    );

    /* ---- RESPONSE ---- */
    res.json({
      user,
      stats: {
        daysTracked,
        avgCarbon,
        bestDay,
        worstDay,
        badge,
        insight,
        joinedDays,
      },
    });
  } catch (err) {
    console.error("Profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ======================
   UPDATE PROFILE
====================== */
/* ======================
   UPDATE PROFILE
====================== */
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, dailyCarbonGoal } = req.body;

    const update = {};

    if (name) {
      update.name = name;
    }

    // ✅ SAFE NUMBER CHECK
    if (dailyCarbonGoal !== undefined) {
      const goal = Number(dailyCarbonGoal);

      if (Number.isNaN(goal) || goal < 0) {
        return res.status(400).json({
          message: "Daily carbon goal must be a valid number"
        });
      }

      update.dailyCarbonGoal = goal;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      update,
      { new: true, runValidators: true }
    ).select("-password");

    res.json(user);
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



