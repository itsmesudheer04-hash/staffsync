import mongoose from 'mongoose';

// Admins and employees are both stored as users, the role tells them apart
export default mongoose.model('User', new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'employee'], default: 'employee' },
  department: { type: String, default: 'General' },
  position: { type: String, default: 'Staff' },
  phone: String,
  joinDate: { type: Date, default: Date.now },
}));
