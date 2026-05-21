import { Router } from 'express';
import requireAuth from '../middleware/requireAuth.js';
import requireRole from '../middleware/requireRole.js';
import validate from '../middleware/validate.js';
import rateLimit from '../middleware/rateLimit.js';
import {
	submitRegistrationSchema,
	approveRegistrationSchema,
	rejectRegistrationSchema,
} from '../schemas/registrations.js';
import * as controller from '../controllers/registrations.js';

const router = Router();

const registrationLimiter = rateLimit({ windowMs: 24 * 60 * 60 * 1000, max: 2 });

// public route, no auth required
router.post('/', registrationLimiter, validate(submitRegistrationSchema), controller.submit);

// admin only
router.get('/', requireAuth, requireRole('ADMIN'), controller.listAll);
router.get('/:id', requireAuth, requireRole('ADMIN'), controller.getOne);
router.get('/:id/cv-url', requireAuth, requireRole('ADMIN'), controller.getCvUrl);
router.patch('/:id/approve', requireAuth, requireRole('ADMIN'), validate(approveRegistrationSchema), controller.approve);
router.patch('/:id/reject', requireAuth, requireRole('ADMIN'), validate(rejectRegistrationSchema), controller.reject);

export default router;
