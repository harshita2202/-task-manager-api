const express = require('express');
const jwt = require('jsonwebtoken');
const Habit = require('../models/Habit');
const router = express.Router();

// Middleware to check if user is logged in
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: "No token, access denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
  }
};

// Get all habits for a user
router.get('/', auth, async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.userId });
    res.json(habits);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add a new habit
router.post('/', auth, async (req, res) => {
  const { name } = req.body;
  try {
    const habit = new Habit({ name, user: req.userId });
    await habit.save();
    res.status(201).json(habit);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Mark habit as completed today
router.post('/:id/complete', auth, async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit) return res.status(404).json({ error: "Habit not found" });

    const today = new Date().toDateString();
    const lastCompletion = habit.completions.slice(-1)[0]?.date?.toDateString();

    if (lastCompletion !== today) {
      habit.completions.push({ date: new Date() });
      habit.streak += 1;
      await habit.save();
      res.json({ message: "Habit completed! Streak updated." });
    } else {
      res.json({ message: "Habit already completed today!" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;