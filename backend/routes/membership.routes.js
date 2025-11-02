const express = require('express');
const router = express.Router();
const {
  createMembership,
  getAllMemberships,
  getMembershipById,
  updateMembershipStatus
} = require('../controllers/membership.controller');

// Create new membership
router.post('/', createMembership);

// Get all memberships
router.get('/', getAllMemberships);

// Get single membership
router.get('/:id', getMembershipById);

// Update membership status
router.patch('/:id/status', updateMembershipStatus);

module.exports = router;