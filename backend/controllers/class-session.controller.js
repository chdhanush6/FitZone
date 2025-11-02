const ClassSession = require('../models/class-session.model');

// Create new class session
exports.createClassSession = async (req, res) => {
  try {
    const session = new ClassSession(req.body);
    await session.save();

    res.status(201).json({
      success: true,
      data: session
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get all class sessions
exports.getAllClassSessions = async (req, res) => {
  try {
    const sessions = await ClassSession.find()
      .populate('trainer', 'fullName specializations')
      .populate('enrolledMembers', 'fullName');

    res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get single class session
exports.getClassSession = async (req, res) => {
  try {
    const session = await ClassSession.findById(req.params.id)
      .populate('trainer', 'fullName specializations')
      .populate('enrolledMembers', 'fullName');

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Class session not found'
      });
    }

    res.status(200).json({
      success: true,
      data: session
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Update class session
exports.updateClassSession = async (req, res) => {
  try {
    const session = await ClassSession.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('trainer', 'fullName specializations')
      .populate('enrolledMembers', 'fullName');

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Class session not found'
      });
    }

    res.status(200).json({
      success: true,
      data: session
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Delete class session
exports.deleteClassSession = async (req, res) => {
  try {
    const session = await ClassSession.findByIdAndDelete(req.params.id);

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Class session not found'
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

// Enroll member in class session
exports.enrollMember = async (req, res) => {
  try {
    const session = await ClassSession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Class session not found'
      });
    }

    // Check if class is full
    if (session.enrolledMembers.length >= session.capacity) {
      return res.status(400).json({
        success: false,
        error: 'Class session is full'
      });
    }

    // Check if member is already enrolled
    if (session.enrolledMembers.includes(req.user.userId)) {
      return res.status(400).json({
        success: false,
        error: 'Member already enrolled in this class'
      });
    }

    session.enrolledMembers.push(req.user.userId);
    await session.save();

    res.status(200).json({
      success: true,
      data: session
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Unenroll member from class session
exports.unenrollMember = async (req, res) => {
  try {
    const session = await ClassSession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Class session not found'
      });
    }

    // Check if member is enrolled
    if (!session.enrolledMembers.includes(req.user.userId)) {
      return res.status(400).json({
        success: false,
        error: 'Member not enrolled in this class'
      });
    }

    session.enrolledMembers = session.enrolledMembers.filter(
      member => member.toString() !== req.user.userId
    );
    await session.save();

    res.status(200).json({
      success: true,
      data: session
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};