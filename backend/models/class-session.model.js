const mongoose = require('mongoose');

const classSessionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['group', 'personal', 'workshop'],
    required: true
  },
  description: String,
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trainer',
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  enrolled: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['confirmed', 'waitlisted', 'cancelled'],
      default: 'confirmed'
    }
  }],
  schedule: {
    startDate: Date,
    endDate: Date,
    recurring: {
      type: Boolean,
      default: false
    },
    recurringDays: [{
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }],
    time: {
      start: String,
      end: String
    }
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'all-levels'],
    default: 'all-levels'
  },
  price: {
    amount: Number,
    currency: {
      type: String,
      default: 'INR'
    }
  },
  location: {
    room: String,
    floor: String
  },
  equipment: [{
    name: String,
    required: Boolean
  }],
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
    default: 'scheduled'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ClassSession', classSessionSchema);