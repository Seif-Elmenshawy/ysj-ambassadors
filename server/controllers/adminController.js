import Ambassador from '../models/Ambassador.js';
import Referral from '../models/Referral.js';
import Task from '../models/Task.js';
import AmbassadorTask from '../models/AmbassadorTask.js';
import AuditLog from '../models/AuditLog.js';

const DAY_MS = 1000 * 60 * 60 * 24;

const log = async (req, action, resource, resourceId, details) => {
  try {
    await AuditLog.create({
      adminId: req.admin?._id,
      adminEmail: req.admin?.email,
      action,
      resource,
      resourceId,
      details,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });
  } catch {}
};

export const getDashboardStats = async (req, res, next) => {
  try {
    const totalAmbassadors = await Ambassador.countDocuments();
    const totalReferrals = await Referral.countDocuments();
    const pendingReferrals = await Referral.countDocuments({ status: 'pending' });
    const topAmbassadors = await Ambassador.find().sort('-score').limit(10).select('name email totalReferrals score country organization');
    res.json({ totalAmbassadors, totalReferrals, pendingReferrals, topAmbassadors });
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find().sort('-createdAt');
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const { title, description, targetReferrals, daysToComplete, score } = req.body;
    const task = await Task.create({ title, description, targetReferrals, daysToComplete, score });
    const ambassadors = await Ambassador.find({}, '_id');
    const ambassadorTasks = ambassadors.map((a) => ({
      ambassadorId: a._id,
      taskId: task._id,
      expiresAt: new Date(Date.now() + task.daysToComplete * DAY_MS),
    }));
    await AmbassadorTask.insertMany(ambassadorTasks);
    await log(req, 'create', 'Task', task._id.toString(), { title, targetReferrals, daysToComplete, score });
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const before = await Task.findById(req.params.id);
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    await log(req, 'update', 'Task', task._id.toString(), { before: before?.toObject(), after: task.toObject() });
    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    await AmbassadorTask.deleteMany({ taskId: req.params.id });
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    await log(req, 'delete', 'Task', req.params.id, { title: task.title });
    res.json({ message: 'Task deleted' });
  } catch (error) {
    next(error);
  }
};

export const getLeaderboard = async (req, res, next) => {
  try {
    const ambassadors = await Ambassador.find().sort('-score').select('name email totalReferrals score referralCode country organization');
    res.json(ambassadors);
  } catch (error) {
    next(error);
  }
};

export const listAmbassadors = async (req, res, next) => {
  try {
    const ambassadors = await Ambassador.find().sort('-createdAt');
    res.json(ambassadors);
  } catch (error) {
    next(error);
  }
};

export const listReferrals = async (req, res, next) => {
  try {
    const referrals = await Referral.find().populate('ambassadorId', 'name email referralCode').sort('-createdAt');
    res.json(referrals);
  } catch (error) {
    next(error);
  }
};

export const approveReferral = async (req, res, next) => {
  try {
    const referral = await Referral.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );
    if (!referral) {
      return res.status(404).json({ message: 'Referral not found' });
    }
    await Ambassador.findByIdAndUpdate(referral.ambassadorId, { $inc: { rewards: 1 } });
    await log(req, 'approve', 'Referral', req.params.id, { referredName: referral.referredName });
    res.json(referral);
  } catch (error) {
    next(error);
  }
};

export const rejectReferral = async (req, res, next) => {
  try {
    const referral = await Referral.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );
    if (!referral) {
      return res.status(404).json({ message: 'Referral not found' });
    }
    await log(req, 'reject', 'Referral', req.params.id, { referredName: referral.referredName });
    res.json(referral);
  } catch (error) {
    next(error);
  }
};

export const deleteAmbassador = async (req, res, next) => {
  try {
    const ambassador = await Ambassador.findById(req.params.id);
    if (!ambassador) {
      return res.status(404).json({ message: 'Ambassador not found' });
    }
    await Referral.deleteMany({ ambassadorId: req.params.id });
    await AmbassadorTask.deleteMany({ ambassadorId: req.params.id });
    await Ambassador.findByIdAndDelete(req.params.id);
    await log(req, 'delete', 'Ambassador', req.params.id, { name: ambassador.name, email: ambassador.email });
    res.json({ message: 'Ambassador and their referrals deleted' });
  } catch (error) {
    next(error);
  }
};
