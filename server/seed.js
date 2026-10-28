// npm run seed: wipes the database and adds an admin, a few employees and a leave request
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';
import Attendance from './models/Attendance.js';
import Leave from './models/Leave.js';

dotenv.config();
await mongoose.connect(process.env.MONGO_URI);
await Promise.all([User.deleteMany(), Attendance.deleteMany(), Leave.deleteMany()]);

await User.create({ name: 'Admin', email: 'admin@staffsync.com', password: await bcrypt.hash('admin123', 10), role: 'admin' });

const pw = await bcrypt.hash('emp123', 10);
const staff = await User.insertMany([
  { name: 'Riya Sharma', email: 'riya@staffsync.com', password: pw, department: 'Engineering', position: 'Developer', phone: '9000000001' },
  { name: 'Amit Verma', email: 'amit@staffsync.com', password: pw, department: 'Engineering', position: 'Tester', phone: '9000000002' },
  { name: 'Neha Singh', email: 'neha@staffsync.com', password: pw, department: 'HR', position: 'HR Executive', phone: '9000000003' },
  { name: 'Karan Patel', email: 'karan@staffsync.com', password: pw, department: 'Sales', position: 'Sales Lead', phone: '9000000004' },
]);

await Leave.create({ user: staff[0]._id, type: 'Casual', fromDate: new Date(), toDate: new Date(Date.now() + 2 * 86400000), reason: 'Family function' });

console.log('Seeded. Admin: admin@staffsync.com / admin123 | Employee: riya@staffsync.com / emp123');
process.exit();
