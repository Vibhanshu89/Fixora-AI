require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const session = require('express-session');
const connectDB = require('./config/database');
const passport = require('./config/passport');

// Routes
const authRoutes = require('./routes/auth.routes');
const chatRoutes = require('./routes/chat.routes');
const workerRoutes = require('./routes/worker.routes');
const bookingRoutes = require('./routes/booking.routes');

const app = express();
const server = http.createServer(app);

// Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.set('io', io);

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// Connect DB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/bookings', bookingRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'Fixora AI Backend Running 🚀' }));

// Socket.io connection
io.on('connection', (socket) => {
  const userId = socket.handshake.auth?.userId;
  console.log(`🔌 Socket connected: ${socket.id} | User: ${userId || 'guest'}`);

  socket.on('disconnect', () => {
    console.log(`❌ Socket disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Fixora AI Backend running on http://localhost:${PORT}`);
});
