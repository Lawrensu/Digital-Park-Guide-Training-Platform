import { Router } from 'express';
import requireAuth from '../middleware/requireAuth.js';
import requireRole from '../middleware/requireRole.js';
import validate from '../middleware/validate.js';
import { issueCertificationSchema } from '../schemas/certifications.js';
import * as controller from '../controllers/certifications.js';

const router = Router();

// public verify; no auth required
router.get('/verify/:id', controller.verify);

router.get('/', requireAuth, controller.list);
router.post('/', requireAuth, requireRole('ADMIN'), validate(issueCertificationSchema), controller.issue);
router.get('/:id/download', requireAuth, controller.download);

export default router;
