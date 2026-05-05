import { Router } from 'express';
import requireAuth from '../middleware/requireAuth.js';
import requireRole from '../middleware/requireRole.js';
import validate from '../middleware/validate.js';
import { submitAttemptSchema, gradeAttemptSchema } from '../schemas/quizAttempts.js';
import * as controller from '../controllers/quizAttempts.js';

const router = Router();

router.get('/', requireAuth, controller.list);
router.get('/:id', requireAuth, controller.getOne);
router.post('/', requireAuth, requireRole('GUIDE'), validate(submitAttemptSchema), controller.submit);
router.patch('/:id/grade', requireAuth, requireRole('ADMIN'), validate(gradeAttemptSchema), controller.grade);

export default router;
