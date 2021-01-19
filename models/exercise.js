const mongoose = require('mongoose')

const exerciseSchema = new mongoose.Schema({
  description: String,
  duration: Number,
  date: Date,
  username: String,
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'users'
  }
});

module.exports = mongoose.model('Exercise', exerciseSchema, 'exercises');
