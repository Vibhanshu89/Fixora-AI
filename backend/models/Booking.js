const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true },
    service: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
      default: 'confirmed',
    },
    scheduledAt: { type: Date, required: true },
    estimatedPrice: { type: Number, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    bookingRef: { type: String, unique: true },
    notes: { type: String, default: '' },
    aiGenerated: { type: Boolean, default: false },
    sessionId: { type: String },
  },
  { timestamps: true }
);

bookingSchema.pre('save', function (next) {
  if (!this.bookingRef) {
    this.bookingRef = 'FX' + Date.now().toString().slice(-6);
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
