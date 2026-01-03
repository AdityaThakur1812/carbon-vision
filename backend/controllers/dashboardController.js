const DailyActivity = require("../models/DailyActivity");
const { breakdownFromEntries } = require("../utils/carbonCalculator");

/* ==============================
   HELPER: Build daily series
================================ */
async function buildDailySeries(userId, days) {
  const start = new Date();
  start.setDate(start.getDate() - (days - 1));
  const startStr = start.toISOString().slice(0, 10);

  const entries = await DailyActivity.find({
    userId,
    date: { $gte: startStr }
  }).sort({ date: 1 });

  const series = [];

  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    const dateStr = d.toISOString().slice(0, 10);

    const found = entries.find(e => e.date === dateStr);

    series.push({
      date: dateStr,
      carbon: found ? Number(found.carbonPoints || 0) : 0
    });
  }

  return series;
}

/* ==============================
   AI-LIKE INSIGHT GENERATOR
================================ */
function generateInsight(breakdown, avgDaily) {
  if (!breakdown) return null;

  const categories = {
    transport: breakdown.transport || 0,
    food: breakdown.food || 0,
    energy: breakdown.energy || 0,
    waste: breakdown.waste || 0
  };

  const [topCategory, value] =
    Object.entries(categories).sort((a, b) => b[1] - a[1])[0];

  if (!value || value === 0) {
    return {
      title: "Excellent footprint 🌱",
      message: "Your emissions are very low. Keep maintaining these habits!"
    };
  }

  const tips = {
    transport: "Reduce car travel or use public transport twice a week.",
    food: "Replace one meat meal per week with a plant-based option.",
    energy: "Lower AC usage by 1 hour per day to save electricity.",
    waste: "Avoid single-use plastics to cut waste emissions."
  };

  return {
    title: `High ${topCategory} emissions`,
    message: tips[topCategory],
    impact: `${Math.round(value * 365)} kg CO₂ / year`
  };
}

/* ==============================
   SUMMARY (last N days)
================================ */
async function summary(req, res) {
  try {
    const userId = req.user.id;
    const days = Number(req.query.days) || 7;

    const series = await buildDailySeries(userId, days);

    const totalCarbon = series.reduce((s, x) => s + x.carbon, 0);
    const averageDaily =
      series.length > 0
        ? Number((totalCarbon / series.length).toFixed(2))
        : 0;

    const start = new Date();
    start.setDate(start.getDate() - (days - 1));
    const startStr = start.toISOString().slice(0, 10);

    const entries = await DailyActivity.find({
      userId,
      date: { $gte: startStr }
    });

    const breakdown = breakdownFromEntries(entries);
    const insight = generateInsight(breakdown, averageDaily);

    res.json({
      days,
      totalCarbon: Number(totalCarbon.toFixed(2)),
      averageDaily,
      breakdown,
      insight
    });
  } catch (err) {
    console.error("Dashboard summary error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

/* ==============================
   TRENDS (daily series)
================================ */
async function trends(req, res) {
  try {
    const userId = req.user.id;
    const days = Number(req.query.days) || 30;

    const series = await buildDailySeries(userId, days);
    res.json(series);
  } catch (err) {
    console.error("Dashboard trends error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

/* ==============================
   COMPARE (mock benchmarks)
================================ */
async function compare(req, res) {
  try {
    const userId = req.user.id;

    const series = await buildDailySeries(userId, 30);
    const avgDaily =
      series.reduce((s, x) => s + x.carbon, 0) / (series.length || 1);

    const userYearly = Number((avgDaily * 365).toFixed(2));

    res.json({
      userYearly,
      cityAvg: Number((userYearly * 1.1).toFixed(2)),
      nationalAvg: Number((userYearly * 0.9).toFixed(2)),
      globalAvg: Number((userYearly * 1.05).toFixed(2))
    });
  } catch (err) {
    console.error("Dashboard compare error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

/* ==============================
   EXPORTS (CRITICAL FIX)
================================ */
module.exports = {
  summary,
  trends,
  compare
};
