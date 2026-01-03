const User = require("../models/User");
const DailyActivity = require("../models/DailyActivity");

/* ================= GET PROFILE ================= */

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const activities = await DailyActivity.find({ userId });

    const daysTracked = activities.length;

    let avgCarbon = 0;
    let minCarbon = null;
    let maxCarbon = null;

    if (daysTracked > 0) {
      const total = activities.reduce(
        (sum, a) => sum + (a.carbonPoints || 0),
        0
      );

      avgCarbon = Number((total / daysTracked).toFixed(2));
      minCarbon = Math.min(...activities.map(a => a.carbonPoints));
      maxCarbon = Math.max(...activities.map(a => a.carbonPoints));
    }

    res.json({
      user,
      stats: {
        daysTracked,
        avgCarbon,
        bestDay: minCarbon,
        worstDay: maxCarbon
      }
    });
  } catch (err) {
    console.error("Profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
