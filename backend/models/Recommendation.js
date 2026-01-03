// backend/models/Recommendation.js
const mongoose = require("mongoose");

const RecommendationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  promptHash: { type: String, required: true, index: true },
  prompt: String,
  llmResponse: String,     // raw LLM output (text)
  suggestions: Array,      // parsed suggestions (optional)
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Recommendation", RecommendationSchema);
