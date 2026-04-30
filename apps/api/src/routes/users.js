import { Router } from 'express';
import requireAuth from '../middleware/requireAuth.js';
import requireRole from '../middleware/requireRole.js';
import validate from '../middleware/validate.js';
import { updateUserSchema, updateUserStatusSchema, createAdminSchema } from '../schemas/users.js';
import * as controller from '../controllers/users.js';

const router = Router();

router.get('/', requireAuth, requireRole('ADMIN'), controller.list);
router.post('/admins', requireAuth, requireRole('ADMIN'), validate(createAdminSchema), controller.createAdmin);
router.get('/:id', requireAuth, controller.getOne);
router.patch('/:id', requireAuth, requireRole('ADMIN'), validate(updateUserSchema), controller.update);
router.patch('/:id/status', requireAuth, requireRole('ADMIN'), validate(updateUserStatusSchema), controller.updateStatus);

export default router;
