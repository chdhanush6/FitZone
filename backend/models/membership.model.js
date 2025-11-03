const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
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
  plan: {
    type: String,
    enum: ['basic', 'pro', 'elite'],
    required: true
  },
  specialRequirements: {
    type: String
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'expired'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Membership', membershipSchema);