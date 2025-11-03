const express = require('express');
const router = express.Router();
const {
  login,
  getAllMemberships,
  getMembershipStats,
  updateMembershipStatus,
  deleteMembership,
  createAdmin
} = require('../controllers/admin.controller');
const { verifyToken, verifyAdmin } = require('../middleware/auth.middleware');

// Public routes
router.post('/login', login);
router.post('/create', createAdmin); // Only for initial setup, can be removed later

// Protected routes (require admin authentication)
router.get('/memberships', verifyToken, verifyAdmin, getAllMemberships);
router.get('/stats', verifyToken, verifyAdmin, getMembershipStats);
router.patch('/memberships/:id/status', verifyToken, verifyAdmin, updateMembershipStatus);
router.delete('/memberships/:id', verifyToken, verifyAdmin, deleteMembership);

module.exports = router;
