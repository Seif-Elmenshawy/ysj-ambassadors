import { Router } from 'express';
import {
  listAmbassadors,
  listReferrals,
  approveReferral,
  rejectReferral,
  deleteAmbassador,
  getDashboardStats,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getLeaderboard,
} from '../controllers/adminController.js';
import { adminLogin, adminLogout, getAdminMe } from '../controllers/authController.js';
import { adminProtect } from '../middleware/adminAuth.js';

const router = Router();

router.post('/login', adminLogin);
router.post('/logout', adminLogout);
router.get('/me', adminProtect, getAdminMe);

router.use(adminProtect);

router.get('/dashboard', getDashboardStats);
router.get('/ambassadors', listAmbassadors);
router.get('/referrals', listReferrals);
router.patch('/referrals/:id/approve', approveReferral);
router.patch('/referrals/:id/reject', rejectReferral);
router.delete('/ambassadors/:id', deleteAmbassador);
router.get('/tasks', getTasks);
router.post('/tasks', createTask);
router.patch('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);
router.get('/leaderboard', getLeaderboard);

export default router;
