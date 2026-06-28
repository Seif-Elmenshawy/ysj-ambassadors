import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const ambassadorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    phone: { type: String, default: '' },
    country: { type: String, default: '' },
    state: { type: String, default: '' },
    city: { type: String, default: '' },
    organization: { type: String, default: '' },
    bio: { type: String, default: '' },
    avatar: { type: String, default: '' },
    referralCode: { type: String, unique: true },
    totalReferrals: { type: Number, default: 0 },
    rewards: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ambassadorSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

ambassadorSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

ambassadorSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model('Ambassador', ambassadorSchema);
