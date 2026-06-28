import mongoose from 'mongoose';

const ambassadorTaskSchema = new mongoose.Schema(
  {
    ambassadorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ambassador', required: true },
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
    progress: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
    scoreEarned: { type: Number, default: 0 },
    startedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

ambassadorTaskSchema.index({ ambassadorId: 1, taskId: 1 }, { unique: true });

export default mongoose.model('AmbassadorTask', ambassadorTaskSchema);
