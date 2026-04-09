const mongoose = require('mongoose');

const chatSessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sessionId: { type: String, required: true, unique: true },
    messages: [
      {
        role: { type: String, enum: ['user', 'assistant', 'tool'], required: true },
        content: { type: String, required: true },
        toolName: { type: String },
        toolResult: { type: mongoose.Schema.Types.Mixed },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    agentSteps: [
      {
        step: String,
        tool: String,
        input: mongoose.Schema.Types.Mixed,
        output: mongoose.Schema.Types.Mixed,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    bookingCreated: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ChatSession', chatSessionSchema);
