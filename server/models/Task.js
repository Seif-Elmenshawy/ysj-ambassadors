import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    targetReferrals: { type: Number, required: true, min: 1 },
    daysToComplete: { type: Number, required: true, min: 1 },
    score: { type: Number, required: true, min: 1 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Task', taskSchema);
