import mongoose from 'mongoose';
import Ambassador from '../models/Ambassador.js';

export function getCollection() {
  return mongoose.connection.db.collection('ysj-app');
}

export function matchReferralCode(code) {
  return { 'application.hearAbout': code, applicationSubmitted: true };
}

export async function getReferralsForAmbassador(ambassador) {
  if (!ambassador.referralCode) return [];
  const docs = await getCollection()
    .find(matchReferralCode(ambassador.referralCode))
    .sort({ 'application.submittedAt': -1, createdAt: -1 })
    .toArray();
  return docs.map((doc) => ({
    _id: doc._id,
    referredName: doc.application?.fullName || doc.username || '',
    referredEmail: doc.email || '',
    status: doc.application?.status === 'submitted' ? 'pending' : doc.application?.status || 'pending',
    createdAt: doc.application?.submittedAt || doc.createdAt,
    referralCode: doc.application?.hearAbout,
  }));
}

export async function countReferralsForAmbassador(ambassador) {
  if (!ambassador.referralCode) return { total: 0, pending: 0, approved: 0, rejected: 0 };
  const pipeline = [
    { $match: matchReferralCode(ambassador.referralCode) },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        pending: { $sum: { $cond: [{ $in: ['$application.status', ['submitted', 'draft', 'under-review']] }, 1, 0] } },
        approved: { $sum: { $cond: [{ $eq: ['$application.status', 'approved'] }, 1, 0] } },
        rejected: { $sum: { $cond: [{ $eq: ['$application.status', 'rejected'] }, 1, 0] } },
      },
    },
  ];
  const result = await getCollection().aggregate(pipeline).toArray();
  if (result.length === 0) return { total: 0, pending: 0, approved: 0, rejected: 0 };
  return result[0];
}

export async function getAllReferrals() {
  const docs = await getCollection()
    .find({ 'application.hearAbout': { $exists: true, $ne: '' }, applicationSubmitted: true })
    .sort({ 'application.submittedAt': -1, createdAt: -1 })
    .toArray();
  const ambassadors = await Ambassador.find({}, 'name email referralCode').lean();
  const ambByCode = Object.fromEntries(ambassadors.map((a) => [a.referralCode, a]));
  return docs.map((doc) => {
    const code = doc.application?.hearAbout;
    const amb = ambByCode[code];
    return {
      _id: doc._id,
      ambassadorId: amb ? { _id: amb._id, name: amb.name, email: amb.email, referralCode: code } : null,
      referredName: doc.application?.fullName || doc.username || '',
      referredEmail: doc.email || '',
      status: doc.application?.status === 'submitted' ? 'pending' : doc.application?.status || 'pending',
      createdAt: doc.application?.submittedAt || doc.createdAt,
      referralCode: code,
    };
  });
}

export async function getReferralsCount() {
  return getCollection().countDocuments({ 'application.hearAbout': { $exists: true, $ne: '' }, applicationSubmitted: true });
}

export async function getPendingReferralsCount() {
  return getCollection().countDocuments({
    'application.hearAbout': { $exists: true, $ne: '' },
    applicationSubmitted: true,
    $or: [{ 'application.status': 'submitted' }, { 'application.status': 'under-review' }, { 'application.status': { $exists: false } }],
  });
}
