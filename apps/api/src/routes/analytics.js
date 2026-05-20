import express from 'express';
import { getAdminTrainingAnalytics } from '../controllers/analytics.js';
import requireAuth from '../middleware/requireAuth.js';
import requireRole from '../middleware/requireRole.js';

const router = express.Router();

router.get('/admin-training', requireAuth, requireRole('ADMIN'), getAdminTrainingAnalytics);

export default router;
