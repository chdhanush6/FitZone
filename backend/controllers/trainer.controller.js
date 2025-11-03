const Trainer = require('../models/trainer.model');

// Create new trainer
exports.createTrainer = async (req, res) => {
  try {
    const trainer = new Trainer(req.body);
    await trainer.save();

    res.status(201).json({
      success: true,
      data: trainer
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get all trainers
exports.getAllTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find();
    
    res.status(200).json({
      success: true,
      count: trainers.length,
      data: trainers
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get single trainer
exports.getTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    
    if (!trainer) {
      return res.status(404).json({
        success: false,
        error: 'Trainer not found'
      });
    }

    res.status(200).json({
      success: true,
      data: trainer
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Update trainer
exports.updateTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!trainer) {
      return res.status(404).json({
        success: false,
        error: 'Trainer not found'
      });
    }

    res.status(200).json({
      success: true,
      data: trainer
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Delete trainer
exports.deleteTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findByIdAndDelete(req.params.id);

    if (!trainer) {
      return res.status(404).json({
        success: false,
        error: 'Trainer not found'
      });
    }

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

// Add review for trainer
exports.addTrainerReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const trainer = await Trainer.findById(req.params.id);

    if (!trainer) {
      return res.status(404).json({
        success: false,
        error: 'Trainer not found'
      });
    }

    trainer.reviews.push({
      user: req.user.userId,
      rating,
      comment
    });

    // Update average rating
    const totalRating = trainer.reviews.reduce((acc, review) => acc + review.rating, 0);
    trainer.averageRating = totalRating / trainer.reviews.length;

    await trainer.save();

    res.status(200).json({
      success: true,
      data: trainer
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get trainer schedule
exports.getTrainerSchedule = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id).select('schedule');

    if (!trainer) {
      return res.status(404).json({
        success: false,
        error: 'Trainer not found'
      });
    }

    res.status(200).json({
      success: true,
      data: trainer.schedule
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Update trainer schedule
exports.updateTrainerSchedule = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);

    if (!trainer) {
      return res.status(404).json({
        success: false,
        error: 'Trainer not found'
      });
    }

    trainer.schedule = req.body.schedule;
    await trainer.save();

    res.status(200).json({
      success: true,
      data: trainer.schedule
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};