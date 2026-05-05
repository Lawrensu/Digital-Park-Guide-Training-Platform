import { Router } from 'express';
import requireAuth from '../middleware/requireAuth.js';
import requireRole from '../middleware/requireRole.js';
import validate from '../middleware/validate.js';
import { createModuleSchema, updateModuleSchema, moduleStatusSchema } from '../schemas/modules.js';
import * as controller from '../controllers/modules.js';

const router = Router();

router.get('/', requireAuth, controller.list);
router.get('/:id', requireAuth, controller.getOne);
router.post('/', requireAuth, requireRole('ADMIN'), validate(createModuleSchema), controller.create);
router.patch('/:id', requireAuth, requireRole('ADMIN'), validate(updateModuleSchema), controller.update);
router.patch('/:id/status', requireAuth, requireRole('ADMIN'), validate(moduleStatusSchema), controller.setStatus);
router.delete('/:id', requireAuth, requireRole('ADMIN'), controller.remove);

export default router;
