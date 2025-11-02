const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  membershipPlan: {
    type: String,
    enum: ['basic', 'pro', 'elite'],
    required: true
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  membershipStatus: {
    type: String,
    enum: ['active', 'expired', 'pending'],
    default: 'pending'
  },
  profileImage: {
    type: String
  },
  attendanceHistory: [{
    date: Date,
    checkIn: Date,
    checkOut: Date
  }],
  fitnessGoals: [{
    goal: String,
    targetDate: Date,
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'achieved'],
      default: 'pending'
    }
  }]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);