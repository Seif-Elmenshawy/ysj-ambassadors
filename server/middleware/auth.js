import { verifyToken } from '../utils/generateToken.js';
import Ambassador from '../models/Ambassador.js';
import Admin from '../models/Admin.js';

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
  try {
    const decoded = verifyToken(token);
    const ambassador = await Ambassador.findById(decoded.id).select('-password');
    const admin = await Admin.findById(decoded.id).select('-password');
    if (!ambassador && !admin) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }
    req.user = ambassador || admin;
    req.userRole = decoded.role || 'ambassador';
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token invalid' });
  }
};

export const adminGuard = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Access denied, admin only' });
  }
  next();
};
