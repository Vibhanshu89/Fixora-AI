const Worker = require('../../models/Worker');

const findWorkerTool = {
  name: 'findWorker',
  description: 'Finds available verified technicians/workers based on service category and city.',
  parameters: {
    type: 'object',
    properties: {
      category: {
        type: 'string',
        description: 'The service category (e.g. electrical, plumbing, ac-repair)',
      },
      city: {
        type: 'string',
        description: 'The city where the service is needed',
      },
    },
    required: ['category'],
  },
};

async function executeFindWorker({ category, city }) {
  const query = { category, isAvailable: true };
  if (city) {
    query.city = { $regex: new RegExp(city, 'i') };
  }

  const workers = await Worker.find(query)
    .sort({ rating: -1, totalJobs: -1 })
    .limit(3)
    .select('name phone category city rating totalJobs pricePerHour experience isAvailable skills');

  if (!workers.length) {
    // Fallback — find in any city
    const fallback = await Worker.find({ category, isAvailable: true })
      .sort({ rating: -1 })
      .limit(3)
      .select('name phone category city rating totalJobs pricePerHour experience isAvailable skills');
    return {
      workers: fallback,
      note: city ? `No workers found in ${city}, showing nearest available workers.` : '',
    };
  }

  return { workers, note: '' };
}

module.exports = { findWorkerTool, executeFindWorker };
