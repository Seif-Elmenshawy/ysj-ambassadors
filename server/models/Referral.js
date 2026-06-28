import mongoose from 'mongoose';

const referralSchema = new mongoose.Schema(
  {
    ambassadorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ambassador', required: true },
    referredName: { type: String, required: true, trim: true },
    referredEmail: { type: String, required: true, lowercase: true, trim: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Referral', referralSchema);
