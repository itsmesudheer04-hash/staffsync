import mongoose from 'mongoose';

export default mongoose.model('Leave', new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['Casual', 'Sick', 'Earned'], default: 'Casual' },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  reason: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, { timestamps: true }));
