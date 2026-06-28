import Referral from '../models/Referral.js';
import Ambassador from '../models/Ambassador.js';
import AmbassadorTask from '../models/AmbassadorTask.js';

export const getReferrals = async (req, res, next) => {
  try {
    const referrals = await Referral.find({ ambassadorId: req.user._id }).sort('-createdAt');
    res.json(referrals);
  } catch (error) {
    next(error);
  }
};

export const createReferral = async (req, res, next) => {
  try {
    const { referredName, referredEmail, notes } = req.body;
    const existing = await Referral.findOne({
      ambassadorId: req.user._id,
      referredEmail,
    });
    if (existing) {
      return res.status(400).json({ message: 'This email has already been referred by you' });
    }
    const referral = await Referral.create({
      ambassadorId: req.user._id,
      referredName,
      referredEmail,
      notes: notes || '',
    });
    await Ambassador.findByIdAndUpdate(req.user._id, { $inc: { totalReferrals: 1 } });
    const activeTasks = await AmbassadorTask.find({
      ambassadorId: req.user._id,
      completed: false,
      expiresAt: { $gt: new Date() },
    }).populate('taskId');
    for (const at of activeTasks) {
      if (!at.taskId || !at.taskId.isActive) continue;
      at.progress += 1;
      if (at.progress >= at.taskId.targetReferrals) {
        at.completed = true;
        at.scoreEarned = at.taskId.score;
        at.completedAt = new Date();
        await Ambassador.findByIdAndUpdate(req.user._id, { $inc: { score: at.scoreEarned } });
      }
      await at.save();
    }
    res.status(201).json(referral);
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
    const total = await Referral.countDocuments({ ambassadorId: req.user._id });
    const pending = await Referral.countDocuments({ ambassadorId: req.user._id, status: 'pending' });
    const approved = await Referral.countDocuments({ ambassadorId: req.user._id, status: 'approved' });
    const rejected = await Referral.countDocuments({ ambassadorId: req.user._id, status: 'rejected' });
    const ambassador = await Ambassador.findById(req.user._id);
    res.json({ total, pending, approved, rejected, rewards: ambassador.rewards, score: ambassador.score });
  } catch (error) {
    next(error);
  }
};
