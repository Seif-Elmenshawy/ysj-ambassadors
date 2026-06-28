import { verifyToken } from '../utils/generateToken.js';
import Admin from '../models/Admin.js';

export const adminProtect = async (req, res, next) => {
  let token;
  if (req.cookies?.adminToken) {
    token = req.cookies.adminToken;
  } else if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no admin token' });
  }
  try {
    const decoded = verifyToken(token);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized, admin only' });
    }
    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) {
      return res.status(401).json({ message: 'Admin not found' });
    }
    req.admin = admin;
    req.adminRole = 'admin';
    next();
  } catch {
    return res.status(401).json({ message: 'Not authorized, token invalid' });
  }
};
