const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, city } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Please fill all required fields' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, password, city });
    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, city: user.city },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.password)
      return res.status(401).json({ message: 'Invalid credentials' });

    const match = await user.matchPassword(password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user._id);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, city: user.city },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json({ user });
};

// Google OAuth callback handler
exports.googleCallback = (req, res) => {
  const token = generateToken(req.user._id);
  res.redirect(`${process.env.CLIENT_URL}/auth/google/success?token=${token}&name=${encodeURIComponent(req.user.name)}&email=${req.user.email}&avatar=${encodeURIComponent(req.user.avatar || '')}&id=${req.user._id}&role=${req.user.role}`);
};
