const Progress = require('../models/progress-tracking.model');

// Create new progress entry
exports.createProgress = async (req, res) => {
  try {
    const progress = new Progress({
      ...req.body,
      user: req.user.userId
    });
    await progress.save();

    res.status(201).json({
      success: true,
      data: progress
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get user's progress history
exports.getProgressHistory = async (req, res) => {
  try {
    const progress = await Progress.find({ user: req.user.userId })
      .sort('-date')
      .populate('user', 'fullName');

    res.status(200).json({
      success: true,
      count: progress.length,
      data: progress
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get single progress entry
exports.getProgress = async (req, res) => {
  try {
    const progress = await Progress.findById(req.params.id)
      .populate('user', 'fullName');

    if (!progress) {
      return res.status(404).json({
        success: false,
        error: 'Progress entry not found'
      });
    }

    // Check if the progress belongs to the authenticated user
    if (progress.user._id.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this progress entry'
      });
    }

    res.status(200).json({
      success: true,
      data: progress
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Update progress entry
exports.updateProgress = async (req, res) => {
  try {
    const progress = await Progress.findById(req.params.id);

    if (!progress) {
      return res.status(404).json({
        success: false,
        error: 'Progress entry not found'
      });
    }

    // Check if the progress belongs to the authenticated user
    if (progress.user.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this progress entry'
      });
    }

    const updatedProgress = await Progress.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('user', 'fullName');

    res.status(200).json({
      success: true,
      data: updatedProgress
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Delete progress entry
exports.deleteProgress = async (req, res) => {
  try {
    const progress = await Progress.findById(req.params.id);

    if (!progress) {
      return res.status(404).json({
        success: false,
        error: 'Progress entry not found'
      });
    }

    // Check if the progress belongs to the authenticated user
    if (progress.user.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this progress entry'
      });
    }

    await progress.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get progress statistics
exports.getProgressStats = async (req, res) => {
  try {
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);

    const progress = await Progress.find({
      user: req.user.userId,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort('date');

    // Calculate statistics
    const stats = {
      weightProgress: {
        start: progress[0]?.measurements.weight || 0,
        end: progress[progress.length - 1]?.measurements.weight || 0,
        change: 0
      },
      workoutStats: {
        totalWorkouts: 0,
        averageDuration: 0,
        totalCaloriesBurned: 0
      },
      nutritionStats: {
        averageCaloriesConsumed: 0,
        averageProteinIntake: 0
      }
    };

    // Calculate weight change
    stats.weightProgress.change = stats.weightProgress.end - stats.weightProgress.start;

    // Calculate workout statistics
    let totalDuration = 0;
    let totalCalories = 0;

    progress.forEach(entry => {
      if (entry.workouts && entry.workouts.length > 0) {
        stats.workoutStats.totalWorkouts += entry.workouts.length;
        entry.workouts.forEach(workout => {
          totalDuration += workout.duration;
          totalCalories += workout.caloriesBurned;
        });
      }
    });

    stats.workoutStats.averageDuration = totalDuration / stats.workoutStats.totalWorkouts || 0;
    stats.workoutStats.totalCaloriesBurned = totalCalories;

    // Calculate nutrition statistics
    let totalCaloriesConsumed = 0;
    let totalProtein = 0;
    let daysWithNutrition = 0;

    progress.forEach(entry => {
      if (entry.nutrition) {
        totalCaloriesConsumed += entry.nutrition.caloriesConsumed;
        totalProtein += entry.nutrition.proteinIntake;
        daysWithNutrition++;
      }
    });

    stats.nutritionStats.averageCaloriesConsumed = totalCaloriesConsumed / daysWithNutrition || 0;
    stats.nutritionStats.averageProteinIntake = totalProtein / daysWithNutrition || 0;

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};