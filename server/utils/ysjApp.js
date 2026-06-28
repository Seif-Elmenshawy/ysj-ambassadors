import mongoose from 'mongoose';
import Ambassador from '../models/Ambassador.js';

export function getYSJConnection() {
  return mongoose.connection.getClient();
}

export async function getCollection() {
  const client = getYSJConnection();
  const db = client.db('ysj-app');
  return db.collection('users');
}

export function matchReferralCode(code) {
  return { 'application.hearAbout': code };
}

export async function getReferralsForAmbassador(ambassador) {
  if (!ambassador.referralCode) return [];
  const coll = await getCollection();
  const docs = await coll
    .find(matchReferralCode(ambassador.referralCode))
    .sort({ 'application.submittedAt': -1, createdAt: -1 })
    .toArray();
  return docs.map((doc) => ({
    _id: doc._id,
    referredName: doc.application?.fullName || doc.username || '',
    referredEmail: doc.email || '',
    status: ['approved', 'rejected'].includes(doc.application?.status) ? doc.application.status : 'pending',
    createdAt: doc.application?.submittedAt || doc.createdAt,
    referralCode: doc.application?.hearAbout,
  }));
}

export async function countReferralsForAmbassador(ambassador) {
  if (!ambassador.referralCode) {
    return { total: 0, pending: 0, approved: 0, rejected: 0 };
  }
  const coll = await getCollection();
  const pipeline = [
    { $match: matchReferralCode(ambassador.referralCode) },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        pending: {
          $sum: {
            $cond: [{
              $not: { $in: ['$application.status', ['approved', 'rejected']] }
            }, 1, 0],
          },
        },
        approved: { $sum: { $cond: [{ $eq: ['$application.status', 'approved'] }, 1, 0] } },
        rejected: { $sum: { $cond: [{ $eq: ['$application.status', 'rejected'] }, 1, 0] } },
      },
    },
  ];
  const result = await coll.aggregate(pipeline).toArray();
  if (result.length === 0) return { total: 0, pending: 0, approved: 0, rejected: 0 };
  return result[0];
}

export async function getAllReferrals() {
  const coll = await getCollection();
  const ambassadors = await Ambassador.find({}, 'name email referralCode').lean();
  const codes = ambassadors.map((a) => a.referralCode).filter(Boolean);
  if (codes.length === 0) return [];
  const docs = await coll
    .find({ 'application.hearAbout': { $in: codes } })
    .sort({ 'application.submittedAt': -1, createdAt: -1 })
    .toArray();
  const ambByCode = Object.fromEntries(ambassadors.map((a) => [a.referralCode, a]));
  return docs.map((doc) => {
    const code = doc.application?.hearAbout;
    const amb = ambByCode[code];
    return {
      _id: doc._id,
      ambassadorId: amb ? { _id: amb._id, name: amb.name, email: amb.email, referralCode: code } : null,
      referredName: doc.application?.fullName || doc.username || '',
      referredEmail: doc.email || '',
      status: ['approved', 'rejected'].includes(doc.application?.status) ? doc.application.status : 'pending',
      createdAt: doc.application?.submittedAt || doc.createdAt,
      referralCode: code,
    };
  });
}

export async function getReferralsCount() {
  const coll = await getCollection();
  const ambassadors = await Ambassador.find({}, 'referralCode').lean();
  const codes = ambassadors.map((a) => a.referralCode).filter(Boolean);
  if (codes.length === 0) return 0;
  return coll.countDocuments({ 'application.hearAbout': { $in: codes } });
}

export async function getPendingReferralsCount() {
  const coll = await getCollection();
  const ambassadors = await Ambassador.find({}, 'referralCode').lean();
  const codes = ambassadors.map((a) => a.referralCode).filter(Boolean);
  if (codes.length === 0) return 0;
  return coll.countDocuments({
    'application.hearAbout': { $in: codes },
    $or: [
      { 'application.status': { $exists: false } },
      { 'application.status': null },
      { 'application.status': { $nin: ['approved', 'rejected'] } },
    ],
  });
}
