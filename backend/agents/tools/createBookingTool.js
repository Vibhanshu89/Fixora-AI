const Booking = require('../../models/Booking');
const Worker = require('../../models/Worker');

const createBookingTool = {
  name: 'createBooking',
  description:
    'Creates a confirmed service booking in the database after user confirms. Returns booking reference number.',
  parameters: {
    type: 'object',
    properties: {
      userId: { type: 'string', description: 'The ID of the user making the booking' },
      workerId: { type: 'string', description: 'The ID of the selected worker' },
      service: { type: 'string', description: 'The name of the service (e.g. Fan Repair)' },
      category: { type: 'string', description: 'The service category' },
      description: { type: 'string', description: 'Brief description of the problem' },
      address: { type: 'string', description: 'Service address from user' },
      city: { type: 'string', description: 'City for the booking' },
      scheduledAt: { type: 'string', description: 'ISO date string for schedule time' },
      sessionId: { type: 'string', description: 'Chat session ID' },
    },
    required: ['userId', 'workerId', 'service', 'category', 'address', 'city', 'scheduledAt'],
  },
};

async function executeCreateBooking(params) {
  const worker = await Worker.findById(params.workerId);
  if (!worker) throw new Error('Worker not found');

  const scheduledDate = new Date(params.scheduledAt);
  const estimatedPrice = worker.pricePerHour * 1.5;

  const booking = await Booking.create({
    userId: params.userId,
    workerId: params.workerId,
    service: params.service,
    category: params.category,
    description: params.description || '',
    address: params.address,
    city: params.city,
    scheduledAt: scheduledDate,
    estimatedPrice,
    aiGenerated: true,
    sessionId: params.sessionId || null,
    status: 'confirmed',
  });

  await Worker.findByIdAndUpdate(params.workerId, { $inc: { totalJobs: 1 } });

  return {
    bookingRef: booking.bookingRef,
    bookingId: booking._id,
    workerName: worker.name,
    workerPhone: worker.phone,
    service: booking.service,
    scheduledAt: booking.scheduledAt,
    estimatedPrice: booking.estimatedPrice,
    status: booking.status,
  };
}

module.exports = { createBookingTool, executeCreateBooking };
