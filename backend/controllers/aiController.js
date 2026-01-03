const DailyActivity = require("../models/DailyActivity");
const Recommendation = require("../models/Recommendation");
const crypto = require("crypto");
const callOpenRouter = require("../utils/openRouterClient");

const CACHE_DAYS = 7;

/* ---------- PROMPT BUILDER ---------- */
function buildPrompt(todaySummary, weeklySummary) {
  return `
Return ONLY valid JSON.

You must generate TWO ARRAYS:

{
  "today": [ { "id", "title", "detail", "yearlySaveKg" } ],
  "weekly": [ { "id", "title", "detail", "yearlySaveKg" } ]
}

RULES:
- TODAY tips must be based ONLY on today's data
- WEEKLY tips must be based on weekly patterns
- Max 3 tips per section
- Be highly personalized
- If no issue exists, give a positive reinforcement tip

TODAY DATA:
${JSON.stringify(todaySummary, null, 2)}

WEEKLY DATA:
${JSON.stringify(weeklySummary, null, 2)}

Return JSON ONLY. No explanation text.
`;
}

/* ---------- CONTROLLER ---------- */
exports.getRecommendations = async (req, res) => {
  console.log("➡️ /api/ai/recommend HIT", req.query);

  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;

    // Fetch last 14 days
    const start = new Date();
    start.setDate(start.getDate() - 13);
    const startStr = start.toISOString().slice(0, 10);

    const entries = await DailyActivity.find({
      userId,
      date: { $gte: startStr }
    });

    console.log("📊 Entries found:", entries.length);

    if (!entries.length) {
      return res.json({
        source: "openrouter",
        today: [],
        weekly: []
      });
    }

    /* ---------- TODAY SUMMARY ---------- */
    const todayStr = new Date().toISOString().slice(0, 10);
    const todayEntry = entries.find(e => e.date === todayStr);

    const todaySummary = todayEntry
      ? {
          carKm: todayEntry.carKm || 0,
          busKm: todayEntry.busKm || 0,
          bikeKm: todayEntry.bikeKm || 0,
          foodType: todayEntry.foodType || "none",
          acHours: todayEntry.acHours || 0,
          plasticUsed: todayEntry.plasticUsed || false
        }
      : {
          noActivityLogged: true
        };

    /* ---------- WEEKLY SUMMARY ---------- */
    const n = entries.length;
    const weeklySummary = {
      daysTracked: n,
      avgCarKm: entries.reduce((s, e) => s + (e.carKm || 0), 0) / n,
      avgAcHours: entries.reduce((s, e) => s + (e.acHours || 0), 0) / n,
      chickenDays: entries.filter(e => e.foodType === "chicken").length,
      beefDays: entries.filter(e => e.foodType === "beef").length,
      plasticDays: entries.filter(e => e.plasticUsed).length
    };

    /* ---------- PROMPT + CACHE ---------- */
    const prompt = buildPrompt(todaySummary, weeklySummary);
    const promptHash = crypto.createHash("md5").update(prompt).digest("hex");

    const forceRegen = req.query.regen === "true";

    if (!forceRegen) {
      const cached = await Recommendation.findOne({ userId, promptHash });
      if (cached) {
        const age =
          (Date.now() - new Date(cached.createdAt)) /
          (1000 * 60 * 60 * 24);

        if (age <= CACHE_DAYS) {
          console.log("✅ Returning cached AI result");
          return res.json({
            source: "cache",
            today: cached.suggestions.today,
            weekly: cached.suggestions.weekly
          });
        }
      }
    }

    /* ---------- CALL OPENROUTER ---------- */
    console.log("🤖 Calling OpenRouter...");
    const aiText = await callOpenRouter(prompt);

    let parsed;
    try {
      parsed = JSON.parse(aiText);
    } catch (err) {
      console.error("❌ Invalid JSON from AI:", aiText);
      return res.status(500).json({
        source: "error",
        today: [],
        weekly: []
      });
    }

    if (!parsed.today || !parsed.weekly) {
      return res.status(500).json({
        source: "error",
        today: [],
        weekly: []
      });
    }

    /* ---------- SAVE CACHE ---------- */
    await Recommendation.create({
      userId,
      promptHash,
      prompt,
      llmResponse: aiText,
      suggestions: parsed
    });

    console.log("✅ AI recommendations generated");

    return res.json({
      source: "openrouter",
      today: parsed.today,
      weekly: parsed.weekly
    });

  } catch (err) {
    console.error("🔥 AI controller crash:", err);
    return res.status(500).json({
      source: "error",
      today: [],
      weekly: []
    });
  }
};
