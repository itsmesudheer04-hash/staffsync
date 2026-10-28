import { Router } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Attendance from '../models/Attendance.js';
import Leave from '../models/Leave.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { today } from '../utils.js';

const router = Router();
router.use(protect, adminOnly); // every route in this file is admin only

router.get('/stats', async (req, res) => {
  const [total, present, pending, byDept] = await Promise.all([
    User.countDocuments({ role: 'employee' }),
    Attendance.countDocuments({ date: today() }),
    Leave.countDocuments({ status: 'pending' }),
    User.aggregate([{ $match: { role: 'employee' } }, { $group: { _id: '$department', count: { $sum: 1 } } }]),
  ]);
  res.json({ total, present, pending, byDept });
});

router.get('/', async (req, res) => {
  res.json(await User.find({ role: 'employee' }).select('-password').sort({ name: 1 }));
});

router.post('/', async (req, res) => {
  const { name, email, department, position, phone } = req.body;
  if (!name || !email) return res.status(400).json({ message: 'Name and email are required' });
  if (await User.findOne({ email: email.toLowerCase() })) return res.status(400).json({ message: 'Email already exists' });

  // new employees get a default password they can be told to use
  const password = await bcrypt.hash('welcome123', 10);
  const user = await User.create({ name, email, password, department, position, phone });
  res.status(201).json({ _id: user._id, name: user.name });
});

router.put('/:id', async (req, res) => {
  const { name, department, position, phone } = req.body; // only these fields can be edited
  const user = await User.findByIdAndUpdate(req.params.id, { name, department, position, phone }, { new: true }).select('-password');
  if (!user) return res.status(404).json({ message: 'Employee not found' });
  res.json(user);
});

router.delete('/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  await Attendance.deleteMany({ user: req.params.id });
  await Leave.deleteMany({ user: req.params.id });
  res.json({ message: 'Deleted' });
});

export default router;
