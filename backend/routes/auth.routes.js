const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const { register, login, getMe, googleCallback } = require('../controllers/authController');
const { updateProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL}/auth?error=google_failed`, session: false }),
  googleCallback
);

module.exports = router;
