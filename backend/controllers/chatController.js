const { runAgent } = require('../agents/agent');

// POST /api/chat
exports.chat = async (req, res) => {
  try {
    const { message, sessionId, city, pendingContext } = req.body;
    const userId = req.user.id;

    if (!message || !sessionId)
      return res.status(400).json({ message: 'Message and sessionId are required' });

    // Get socket from app
    const io = req.app.get('io');
    const socket = io ? Array.from(io.sockets.sockets.values()).find(
      (s) => s.handshake.auth?.userId === userId
    ) : null;

    const result = await runAgent({
      userMessage: message,
      userId,
      sessionId,
      userCity: city || req.user.city,
      pendingContext,
      socket,
    });

    res.json(result);
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ message: err.message });
  }
};

// GET /api/chat/sessions
exports.getSessions = async (req, res) => {
  const ChatSession = require('../models/ChatSession');
  const sessions = await ChatSession.find({ userId: req.user.id })
    .sort({ updatedAt: -1 })
    .limit(20)
    .select('sessionId messages updatedAt bookingCreated');
  res.json({ sessions });
};

// GET /api/chat/session/:sessionId
exports.getSession = async (req, res) => {
  const ChatSession = require('../models/ChatSession');
  const session = await ChatSession.findOne({
    sessionId: req.params.sessionId,
    userId: req.user.id,
  });
  if (!session) return res.status(404).json({ message: 'Session not found' });
  res.json({ session });
};
