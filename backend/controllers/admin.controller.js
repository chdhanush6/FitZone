const Admin = require('../models/admin.model');
const Membership = require('../models/membership.model');
const jwt = require('jsonwebtoken');

// Admin login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide username and password'
      });
    }

    // Check if admin exists
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        adminId: admin._id,
        username: admin.username,
        role: admin.role
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      data: {
        token,
        admin: {
          id: admin._id,
          username: admin.username,
          email: admin.email,
          role: admin.role
        }
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred during login'
    });
  }
};

// Get all memberships (pending and approved)
exports.getAllMemberships = async (req, res) => {
  try {
    const { status } = req.query;
    
    let query = {};
    if (status) {
      query.status = status;
    }

    const memberships = await Membership.find(query).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: memberships.length,
      data: memberships
    });
  } catch (error) {
    console.error('Error fetching memberships:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred while fetching memberships'
    });
  }
};

// Get membership statistics
exports.getMembershipStats = async (req, res) => {
  try {
    const totalMembers = await Membership.countDocuments();
    const pendingMembers = await Membership.countDocuments({ status: 'pending' });
    const activeMembers = await Membership.countDocuments({ status: 'active' });
    const expiredMembers = await Membership.countDocuments({ status: 'expired' });

    // Count by plan
    const basicMembers = await Membership.countDocuments({ plan: 'basic' });
    const proMembers = await Membership.countDocuments({ plan: 'pro' });
    const eliteMembers = await Membership.countDocuments({ plan: 'elite' });

    res.status(200).json({
      success: true,
      data: {
        total: totalMembers,
        pending: pendingMembers,
        active: activeMembers,
        expired: expiredMembers,
        byPlan: {
          basic: basicMembers,
          pro: proMembers,
          elite: eliteMembers
        }
      }
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred while fetching statistics'
    });
  }
};

// Update membership status
exports.updateMembershipStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!['pending', 'active', 'expired'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be pending, active, or expired'
      });
    }

    const membership = await Membership.findByIdAndUpdate(
      id,
      { status },
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
      message: `Membership status updated to ${status}`,
      data: membership
    });
  } catch (error) {
    console.error('Error updating membership status:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred while updating membership status'
    });
  }
};

// Delete membership
exports.deleteMembership = async (req, res) => {
  try {
    const { id } = req.params;

    const membership = await Membership.findByIdAndDelete(id);

    if (!membership) {
      return res.status(404).json({
        success: false,
        error: 'Membership not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Membership deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting membership:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred while deleting membership'
    });
  }
};

// Create a new admin (for initial setup)
exports.createAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide username, email, and password'
      });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ $or: [{ username }, { email }] });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        error: 'Admin with this username or email already exists'
      });
    }

    const admin = new Admin({
      username,
      email,
      password
    });

    await admin.save();

    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      data: {
        id: admin._id,
        username: admin.username,
        email: admin.email
      }
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred while creating admin'
    });
  }
};
