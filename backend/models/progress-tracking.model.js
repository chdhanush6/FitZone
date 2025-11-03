const mongoose = require('mongoose');

const progressTrackingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  measurements: [{
    date: {
      type: Date,
      default: Date.now
    },
    weight: Number,
    height: Number,
    bodyFat: Number,
    chest: Number,
    waist: Number,
    hips: Number,
    arms: Number,
    thighs: Number
  }],
  workouts: [{
    date: Date,
    type: String,
    exercises: [{
      name: String,
      sets: Number,
      reps: Number,
      weight: Number,
      duration: Number,
      notes: String
    }],
    totalDuration: Number,
    caloriesBurned: Number
  }],
  nutrition: [{
    date: Date,
    meals: [{
      type: {
        type: String,
        enum: ['breakfast', 'lunch', 'dinner', 'snack']
      },
      foods: [{
        name: String,
        portion: String,
        calories: Number,
        protein: Number,
        carbs: Number,
        fats: Number
      }]
    }],
    totalCalories: Number,
    waterIntake: Number
  }],
  goals: [{
    type: {
      type: String,
      enum: ['weight', 'strength', 'endurance', 'flexibility']
    },
    target: Number,
    unit: String,
    startDate: Date,
    targetDate: Date,
    status: {
      type: String,
      enum: ['in-progress', 'achieved', 'missed'],
      default: 'in-progress'
    },
    notes: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('ProgressTracking', progressTrackingSchema);