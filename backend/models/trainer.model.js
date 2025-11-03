const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  specialization: [{
    type: String,
    enum: ['strength', 'cardio', 'yoga', 'pilates', 'crossfit', 'nutrition']
  }],
  experience: {
    type: Number,
    required: true
  },
  certifications: [{
    name: String,
    issuedBy: String,
    year: Number
  }],
  schedule: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    slots: [{
      startTime: String,
      endTime: String,
      isBooked: {
        type: Boolean,
        default: false
      }
    }]
  }],
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  },
  reviews: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: Number,
    comment: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  profileImage: String,
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Trainer', trainerSchema);