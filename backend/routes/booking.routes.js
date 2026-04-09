const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  getMyBookings, getBookingById, updateStatus, getAllBookings, getStats
} = require('../controllers/bookingController');

router.get('/my', protect, getMyBookings);
router.get('/admin/all', protect, adminOnly, getAllBookings);
router.get('/admin/stats', protect, adminOnly, getStats);
router.get('/:id', protect, getBookingById);
router.patch('/:id/status', protect, updateStatus);

module.exports = router;
