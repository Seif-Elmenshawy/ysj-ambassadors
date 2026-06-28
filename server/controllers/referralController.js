import mongoose from 'mongoose';
import Ambassador from '../models/Ambassador.js';
import AmbassadorTask from '../models/AmbassadorTask.js';
import { getReferralsForAmbassador, countReferralsForAmbassador } from '../utils/ysjApp.js';

export const getReferrals = async (req, res, next) => {
  try {
    const ambassador = await Ambassador.findById(req.user._id);
    if (!ambassador) return res.status(404).json({ message: 'Ambassador not found' });
    const referrals = await getReferralsForAmbassador(ambassador);
    res.json(referrals);
  } catch (error) {
    next(error);
  }
};

export const createReferral = async (req, res, next) => {
  try {
    res.status(400).json({ message: 'Referrals are now automatically synced from the application portal. Share your referral code with applicants to track referrals.' });
  } catch (error) {
    next(error);
  }
};

export const getMyTasks = async (req, res, next) => {
  try {
    const tasks = await AmbassadorTask.find({ ambassadorId: req.user._id })
      .populate('taskId').sort('-createdAt');
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

export const getStats = async (req, res, next) => {
  try {
    const ambassador = await Ambassador.findById(req.user._id);
    if (!ambassador) return res.status(404).json({ message: 'Ambassador not found' });
    const counts = await countReferralsForAmbassador(ambassador);
    if (ambassador.totalReferrals !== counts.total) {
      ambassador.totalReferrals = counts.total;
      await ambassador.save();
    }
    res.json({ total: counts.total, pending: counts.pending, approved: counts.approved, rejected: counts.rejected, rewards: ambassador.rewards, score: ambassador.score });
  } catch (error) {
    next(error);
  }
};
