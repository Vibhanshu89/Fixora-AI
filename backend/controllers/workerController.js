const Worker = require('../models/Worker');

// GET /api/workers
exports.getAllWorkers = async (req, res) => {
  try {
    const { category, city, available } = req.query;
    const query = {};
    if (category) query.category = category;
    if (city) query.city = { $regex: new RegExp(city, 'i') };
    if (available === 'true') query.isAvailable = true;

    const workers = await Worker.find(query).sort({ rating: -1 });
    res.json({ workers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/workers/:id
exports.getWorkerById = async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);
    if (!worker) return res.status(404).json({ message: 'Worker not found' });
    res.json({ worker });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/workers (Admin only)
exports.createWorker = async (req, res) => {
  try {
    const worker = await Worker.create(req.body);
    res.status(201).json({ worker });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/workers/:id (Admin)
exports.updateWorker = async (req, res) => {
  try {
    const worker = await Worker.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ worker });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/workers/:id (Admin)
exports.deleteWorker = async (req, res) => {
  try {
    await Worker.findByIdAndDelete(req.params.id);
    res.json({ message: 'Worker deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
