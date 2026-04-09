const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  getAllWorkers, getWorkerById, createWorker, updateWorker, deleteWorker
} = require('../controllers/workerController');

router.get('/', getAllWorkers);
router.get('/:id', getWorkerById);
router.post('/', protect, adminOnly, createWorker);
router.put('/:id', protect, adminOnly, updateWorker);
router.delete('/:id', protect, adminOnly, deleteWorker);

module.exports = router;
