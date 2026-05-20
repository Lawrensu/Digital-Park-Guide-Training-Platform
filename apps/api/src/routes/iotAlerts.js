import { Router } from 'express';
import requireAuth from '../middleware/requireAuth.js';
import requireRole from '../middleware/requireRole.js';
import validate from '../middleware/validate.js';
import { flagAlertSchema } from '../schemas/iotAlerts.js';
import * as controller from '../controllers/iotAlerts.js';

const router = Router();

router.get('/', requireAuth, requireRole('ADMIN'), controller.list);
router.get('/:id/evidence-url', requireAuth, requireRole('ADMIN'), controller.getEvidenceUrl);
router.get('/:id', requireAuth, requireRole('ADMIN'), controller.getOne);
router.patch('/:id/flag', requireAuth, requireRole('ADMIN'), validate(flagAlertSchema), controller.flag);

export default router;
