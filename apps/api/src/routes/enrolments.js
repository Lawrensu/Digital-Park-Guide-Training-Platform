import { Router } from 'express';
import requireAuth from '../middleware/requireAuth.js';
import requireRole from '../middleware/requireRole.js';
import validate from '../middleware/validate.js';
import {
	createEnrolmentSchema,
	selfEnrolmentSchema,
	updateEnrolmentSchema,
} from '../schemas/enrolments.js';
import * as controller from '../controllers/enrolments.js';

const router = Router();

router.get('/', requireAuth, controller.list);
router.post('/', requireAuth, requireRole('ADMIN'), validate(createEnrolmentSchema), controller.create);
router.post('/me', requireAuth, requireRole('GUIDE'), validate(selfEnrolmentSchema), controller.selfEnrol);
router.patch('/:id', requireAuth, requireRole('ADMIN'), validate(updateEnrolmentSchema), controller.update);
router.delete('/:id', requireAuth, requireRole('ADMIN'), controller.remove);

export default router;
