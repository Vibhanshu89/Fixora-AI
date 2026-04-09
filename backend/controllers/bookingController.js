const Booking = require('../models/Booking');
const User = require('../models/User');

// GET /api/bookings (user's own)
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate('workerId', 'name phone rating avatar category')
      .sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/bookings/:id
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('workerId', 'name phone rating avatar')
      .populate('userId', 'name email');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json({ booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/bookings/:id/status
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('workerId', 'name phone');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json({ booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/bookings/admin/all (Admin only)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name email')
      .populate('workerId', 'name phone category')
      .sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/bookings/admin/stats
exports.getStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const confirmed = await Booking.countDocuments({ status: 'confirmed' });
    const completed = await Booking.countDocuments({ status: 'completed' });
    const cancelled = await Booking.countDocuments({ status: 'cancelled' });
    const totalUsers = await User.countDocuments({ role: 'user' });
    const Worker = require('../models/Worker');
    const totalWorkers = await Worker.countDocuments();

    const revenueResult = await Booking.aggregate([
      { $match: { status: { $in: ['confirmed', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$estimatedPrice' } } },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    res.json({ totalBookings, confirmed, completed, cancelled, totalUsers, totalWorkers, totalRevenue });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
