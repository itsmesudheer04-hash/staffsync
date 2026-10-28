import { Router } from 'express';
import Leave from '../models/Leave.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

router.post('/', protect, async (req, res) => {
  const { type, fromDate, toDate, reason } = req.body;
  if (!fromDate || !toDate) return res.status(400).json({ message: 'Dates are required' });
  if (new Date(fromDate) > new Date(toDate)) return res.status(400).json({ message: 'End date is before start date' });
  res.status(201).json(await Leave.create({ user: req.user.id, type, fromDate, toDate, reason }));
});

router.get('/mine', protect, async (req, res) => {
  res.json(await Leave.find({ user: req.user.id }).sort({ createdAt: -1 }));
});

router.get('/', protect, adminOnly, async (req, res) => {
  res.json(await Leave.find().populate('user', 'name department').sort({ createdAt: -1 }));
});

// admin approves or rejects a pending request
router.patch('/:id', protect, adminOnly, async (req, res) => {
  const { status } = req.body;
  if (!['approved', 'rejected'].includes(status)) return res.status(400).json({ message: 'Invalid status' });
  const leave = await Leave.findOneAndUpdate({ _id: req.params.id, status: 'pending' }, { status }, { new: true });
  if (!leave) return res.status(400).json({ message: 'Request not found or already decided' });
  res.json(leave);
});

export default router;
