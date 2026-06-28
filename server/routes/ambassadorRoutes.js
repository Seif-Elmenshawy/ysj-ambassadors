import { Router } from 'express';
import { getAmbassador, updateProfile, getLeaderboard } from '../controllers/ambassadorController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/leaderboard', getLeaderboard);
router.get('/:id', protect, getAmbassador);
router.patch('/:id', protect, updateProfile);

export default router;
