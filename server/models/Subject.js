const mongoose = require('mongoose');

const sessionItemSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'missed'],
    default: 'pending'
  }
}, { timestamps: true });

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  totalHours: {
    type: Number,
    default: 0
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessions: [sessionItemSchema]
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);