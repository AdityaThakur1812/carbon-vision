const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');

// POST /api/activities
router.post('/', async (req, res) => {
  try {
    const { userId, transport, energy, food, waste } = req.body;
    const total = transport + energy + food + waste;

    const activity = new Activity({ userId, transport, energy, food, waste, total });
    await activity.save();

    res.status(201).json({ message: 'Activity saved', activity });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/activities/:userId
router.get('/:userId', async (req, res) => {
  try {
    const activities = await Activity.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
