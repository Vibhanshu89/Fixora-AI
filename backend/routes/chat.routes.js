const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { chat, getSessions, getSession } = require('../controllers/chatController');

router.post('/', protect, chat);
router.get('/sessions', protect, getSessions);
router.get('/session/:sessionId', protect, getSession);

module.exports = router;
