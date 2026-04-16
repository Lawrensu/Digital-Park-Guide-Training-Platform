import { Router } from 'express';
import requireAuth from '../middleware/requireAuth.js';
import requireRole from '../middleware/requireRole.js';
import validate from '../middleware/validate.js';
import { customNotificationSchema } from '../schemas/notifications.js';
import * as controller from '../controllers/notifications.js';

const router = Router();

router.get('/me', requireAuth, controller.listMine);
router.patch('/me/read-all', requireAuth, controller.markAllRead);
router.patch('/:id/read', requireAuth, controller.markRead);
router.post('/custom', requireAuth, requireRole('ADMIN'), validate(customNotificationSchema), controller.sendCustom);

export default router;
