import { Router } from 'express';
import requireAuth from '../middleware/requireAuth.js';
import requireRole from '../middleware/requireRole.js';
import validate from '../middleware/validate.js';
import { createBadgeSchema, updateBadgeSchema } from '../schemas/badges.js';
import * as controller from '../controllers/badges.js';

const router = Router();

router.get('/', requireAuth, controller.list);
router.post('/', requireAuth, requireRole('ADMIN'), validate(createBadgeSchema), controller.create);
router.patch('/:id', requireAuth, requireRole('ADMIN'), validate(updateBadgeSchema), controller.update);
router.delete('/:id', requireAuth, requireRole('ADMIN'), controller.remove);
router.get('/users/:userId', requireAuth, controller.listEarned);

export default router;
