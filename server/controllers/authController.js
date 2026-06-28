import Ambassador from '../models/Ambassador.js';
import Admin from '../models/Admin.js';
import Task from '../models/Task.js';
import AmbassadorTask from '../models/AmbassadorTask.js';
import AuditLog from '../models/AuditLog.js';
import { generateToken } from '../utils/generateToken.js';
import { generateReferralCode } from '../utils/generateCode.js';
import { checkLoginAttempts, recordFailedAttempt, clearAttempts } from '../utils/rateLimit.js';

const DAY_MS = 1000 * 60 * 60 * 24;

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, country, state, city, organization, bio } = req.body;
    const existing = await Ambassador.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    const ambassador = await Ambassador.create({ name, email, password, phone, country, state, city, organization, bio });
    const count = await Ambassador.countDocuments();
    ambassador.referralCode = generateReferralCode(count);
    await ambassador.save();
    const activeTasks = await Task.find({ isActive: true }, '_id daysToComplete');
    const ambassadorTasks = activeTasks.map((t) => ({
      ambassadorId: ambassador._id,
      taskId: t._id,
      expiresAt: new Date(Date.now() + t.daysToComplete * DAY_MS),
    }));
    if (ambassadorTasks.length) await AmbassadorTask.insertMany(ambassadorTasks);
    const token = generateToken(ambassador._id, 'ambassador');
    res.status(201).json({ token, user: ambassador });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const ambassador = await Ambassador.findOne({ email });
    if (!ambassador || !(await ambassador.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = generateToken(ambassador._id, 'ambassador');
    res.json({ token, user: ambassador });
  } catch (error) {
    next(error);
  }
};

export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const rateCheck = checkLoginAttempts(email);
    if (!rateCheck.allowed) {
      return res.status(429).json({
        message: `Too many attempts. Try again in ${rateCheck.retryAfter} seconds.`,
        retryAfter: rateCheck.retryAfter,
      });
    }

    const admin = await Admin.findOne({ email });
    if (!admin || !(await admin.comparePassword(password))) {
      recordFailedAttempt(email);
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    clearAttempts(email);
    const token = generateToken(admin._id, 'admin');

    res.cookie('adminToken', token, COOKIE_OPTIONS);

    await AuditLog.create({
      adminId: admin._id,
      adminEmail: admin.email,
      action: 'login',
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({ token, user: admin });
  } catch (error) {
    next(error);
  }
};

export const adminLogout = async (req, res) => {
  res.clearCookie('adminToken', { path: '/' });
  res.json({ message: 'Logged out' });
};

export const getMe = async (req, res) => {
  res.json({ user: req.user, role: req.userRole });
};

export const getAdminMe = async (req, res) => {
  res.json({ admin: req.admin });
};
