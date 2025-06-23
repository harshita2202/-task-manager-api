const mongoose = require('mongoose');

const HabitSchema = new mongoose.Schema({
  name: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  streak: { type: Number, default: 0 },
  lastCompleted: { type: Date },
  completions: [{ date: { type: Date, default: Date.now } }],
});

module.exports = mongoose.model('Habit', HabitSchema);