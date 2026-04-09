const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, unique: true },
    phone: { type: String, required: true },
    avatar: { type: String, default: '' },
    category: {
      type: String,
      required: true,
      enum: [
        'electrical',
        'plumbing',
        'ac-repair',
        'carpentry',
        'cleaning',
        'painting',
        'appliance-repair',
        'pest-control',
        'cctv-installation',
        'ro-service',
        'salon-at-home',
        'gardening',
        'home-automation',
        'solar-panel'
      ],
    },
    skills: [{ type: String }],
    city: { type: String, required: true },
    address: { type: String },
    rating: { type: Number, default: 4.5, min: 1, max: 5 },
    totalJobs: { type: Number, default: 0 },
    pricePerHour: { type: Number, required: true },
    isAvailable: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: true },
    experience: { type: Number, default: 1 },
    bio: { type: String, default: '' },
    reviews: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        userName: String,
        rating: Number,
        comment: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Worker', workerSchema);
