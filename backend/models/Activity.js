const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  transport: { type: Number, default: 0 }, // kg CO2
  energy: { type: Number, default: 0 },    // kg CO2
  food: { type: Number, default: 0 },      // kg CO2
  waste: { type: Number, default: 0 },     // kg CO2
  total: { type: Number, default: 0 },     // sum of all
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Activity', activitySchema);
