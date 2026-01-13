import express from 'express';
import { getStats, getRecentRegistrations } from '../controllers/dashboardController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', protect, adminOnly, getStats);
router.get('/recent', protect, adminOnly, getRecentRegistrations);

export default router;
