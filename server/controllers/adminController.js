import Ambassador from '../models/Ambassador.js';
import Referral from '../models/Referral.js';
import Task from '../models/Task.js';
import AmbassadorTask from '../models/AmbassadorTask.js';
import AuditLog from '../models/AuditLog.js';
import { getCollection, getAllReferrals, getReferralsCount, getPendingReferralsCount, countReferralsForAmbassador } from '../utils/ysjApp.js';

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
    const totalReferrals = await getReferralsCount();
    const pendingReferrals = await getPendingReferralsCount();
    const topAmbassadors = await Ambassador.find().sort('-score').limit(10).select('name email totalReferrals score country organization');
    const syncedTop = await Promise.all(
      topAmbassadors.map(async (amb) => {
        const counts = await countReferralsForAmbassador(amb);
        if (amb.totalReferrals !== counts.total) {
          amb.totalReferrals = counts.total;
          await amb.save();
        }
        return amb;
      })
    );
    res.json({ totalAmbassadors, totalReferrals, pendingReferrals, topAmbassadors: syncedTop });
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
    const synced = await Promise.all(
      ambassadors.map(async (amb) => {
        const counts = await countReferralsForAmbassador(amb);
        if (amb.totalReferrals !== counts.total) {
          amb.totalReferrals = counts.total;
          await amb.save();
        }
        return amb;
      })
    );
    res.json(synced);
  } catch (error) {
    next(error);
  }
};

export const listAmbassadors = async (req, res, next) => {
  try {
    const ambassadors = await Ambassador.find().sort('-createdAt');
    const synced = await Promise.all(
      ambassadors.map(async (amb) => {
        const counts = await countReferralsForAmbassador(amb);
        if (amb.totalReferrals !== counts.total) {
          amb.totalReferrals = counts.total;
          await amb.save();
        }
        return amb;
      })
    );
    res.json(synced);
  } catch (error) {
    next(error);
  }
};

export const listReferrals = async (req, res, next) => {
  try {
    const referrals = await getAllReferrals();
    res.json(referrals);
  } catch (error) {
    next(error);
  }
};

export const approveReferral = async (req, res, next) => {
  try {
    const collection = getCollection();
    const doc = await collection.findOne({ _id: new mongoose.Types.ObjectId(req.params.id) });
    if (!doc) {
      return res.status(404).json({ message: 'Application not found' });
    }
    await collection.updateOne(
      { _id: doc._id },
      { $set: { 'application.status': 'approved' } }
    );
    const ambassador = await Ambassador.findOne({ referralCode: doc.application?.hearAbout });
    if (ambassador) {
      await Ambassador.findByIdAndUpdate(ambassador._id, { $inc: { rewards: 1 } });
    }
    await log(req, 'approve', 'Referral', req.params.id, { referredName: doc.application?.fullName, email: doc.email });
    res.json({ message: 'Application approved', _id: req.params.id, status: 'approved' });
  } catch (error) {
    next(error);
  }
};

export const rejectReferral = async (req, res, next) => {
  try {
    const collection = getCollection();
    const doc = await collection.findOne({ _id: new mongoose.Types.ObjectId(req.params.id) });
    if (!doc) {
      return res.status(404).json({ message: 'Application not found' });
    }
    await collection.updateOne(
      { _id: doc._id },
      { $set: { 'application.status': 'rejected' } }
    );
    await log(req, 'reject', 'Referral', req.params.id, { referredName: doc.application?.fullName, email: doc.email });
    res.json({ message: 'Application rejected', _id: req.params.id, status: 'rejected' });
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
