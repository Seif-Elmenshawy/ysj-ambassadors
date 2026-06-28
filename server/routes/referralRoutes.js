import { Router } from 'express';
import { getReferrals, createReferral, getStats, getMyTasks } from '../controllers/referralController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/', protect, getReferrals);
router.post('/', protect, createReferral);
router.get('/stats', protect, getStats);
router.get('/tasks', protect, getMyTasks);

export default router;
