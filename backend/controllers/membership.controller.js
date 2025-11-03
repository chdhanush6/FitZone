const Membership = require('../models/membership.model');

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number
const isValidPhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
};

// Create new membership application
const createMembership = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, plan, specialRequirements } = req.body;

    // Validation
    if (!fullName || !email || !phoneNumber || !plan) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all required fields'
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address'
      });
    }

    if (!isValidPhone(phoneNumber)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid 10-digit phone number'
      });
    }

    if (!['basic', 'pro', 'elite'].includes(plan)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid membership plan selected'
      });
    }

    // Check if email already exists
    const existingMember = await Membership.findOne({ email });
    if (existingMember) {
      return res.status(400).json({
        success: false,
        error: 'This email is already registered. Please use a different email.'
      });
    }

    const membership = new Membership({
      fullName,
      email,
      phoneNumber,
      plan,
      specialRequirements,
      status: 'pending'
    });

    await membership.save();

    res.status(201).json({
      success: true,
      message: 'Membership application submitted successfully!',
      data: membership
    });
  } catch (error) {
    console.error('Error creating membership:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred while processing your application. Please try again.'
    });
  }
};

// Get all memberships
const getAllMemberships = async (req, res) => {
  try {
    const memberships = await Membership.find();
    res.status(200).json({
      success: true,
      data: memberships
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get single membership by ID
const getMembershipById = async (req, res) => {
  try {
    const membership = await Membership.findById(req.params.id);
    if (!membership) {
      return res.status(404).json({
        success: false,
        error: 'Membership not found'
      });
    }
    res.status(200).json({
      success: true,
      data: membership
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Update membership status
const updateMembershipStatus = async (req, res) => {
  try {
    const membership = await Membership.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!membership) {
      return res.status(404).json({
        success: false,
        error: 'Membership not found'
      });
    }
    res.status(200).json({
      success: true,
      data: membership
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  createMembership,
  getAllMemberships,
  getMembershipById,
  updateMembershipStatus
};