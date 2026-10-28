import { Router } from 'express';
import Attendance from '../models/Attendance.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { today } from '../utils.js';

const router = Router();

router.post('/checkin', protect, async (req, res) => {
  const exists = await Attendance.findOne({ user: req.user.id, date: today() });
  if (exists) return res.status(400).json({ message: 'Already checked in today' });
  res.status(201).json(await Attendance.create({ user: req.user.id, date: today(), checkIn: new Date() }));
});

router.post('/checkout', protect, async (req, res) => {
  const record = await Attendance.findOne({ user: req.user.id, date: today() });
  if (!record) return res.status(400).json({ message: 'Check in first' });
  if (record.checkOut) return res.status(400).json({ message: 'Already checked out today' });
  record.checkOut = new Date();
  await record.save();
  res.json(record);
});

router.get('/today', protect, async (req, res) => {
  res.json(await Attendance.findOne({ user: req.user.id, date: today() }));
});

router.get('/mine', protect, async (req, res) => {
  res.json(await Attendance.find({ user: req.user.id }).sort({ date: -1 }).limit(30));
});

// admin: everyone's attendance for a date (?date=YYYY-MM-DD)
router.get('/', protect, adminOnly, async (req, res) => {
  const date = req.query.date || today();
  res.json(await Attendance.find({ date }).populate('user', 'name department'));
});

export default router;
