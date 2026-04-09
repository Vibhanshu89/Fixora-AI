const Booking = require('../../models/Booking');

const getBookingStatusTool = {
  name: 'getBookingStatus',
  description: 'Retrieves the current status of an existing booking by booking reference or booking ID.',
  parameters: {
    type: 'object',
    properties: {
      bookingRef: { type: 'string', description: 'The booking reference number (e.g. FX123456)' },
    },
    required: ['bookingRef'],
  },
};

async function executeGetBookingStatus({ bookingRef }) {
  const booking = await Booking.findOne({ bookingRef })
    .populate('workerId', 'name phone rating')
    .populate('userId', 'name email');

  if (!booking) return { error: 'Booking not found', bookingRef };

  return {
    bookingRef: booking.bookingRef,
    service: booking.service,
    status: booking.status,
    workerName: booking.workerId?.name,
    workerPhone: booking.workerId?.phone,
    scheduledAt: booking.scheduledAt,
    estimatedPrice: booking.estimatedPrice,
    address: booking.address,
  };
}

module.exports = { getBookingStatusTool, executeGetBookingStatus };
