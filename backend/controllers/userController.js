const User = require('../models/User');

exports.updateProfile = async (req, res) => {
  try {
    const { name, city, phone, address } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, city, phone, address },
      { new: true, runValidators: true }
    ).select('-password');
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
