import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  adminEmail: { type: String, required: true },
  action: { type: String, required: true },
  resource: { type: String },
  resourceId: { type: String },
  details: { type: Object },
  ip: { type: String },
  userAgent: { type: String },
}, { timestamps: true });

auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ adminEmail: 1 });

export default mongoose.model('AuditLog', auditLogSchema);
