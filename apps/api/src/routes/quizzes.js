import { Router } from 'express';
import requireAuth from '../middleware/requireAuth.js';
import requireRole from '../middleware/requireRole.js';
import validate from '../middleware/validate.js';
import {
	createQuizSchema,
	updateQuizSchema,
	createQuestionSchema,
	updateQuestionSchema,
} from '../schemas/quizzes.js';
import * as controller from '../controllers/quizzes.js';

const router = Router();

router.get('/', requireAuth, controller.list);
router.get('/:id', requireAuth, controller.getOne);
router.post('/', requireAuth, requireRole('ADMIN'), validate(createQuizSchema), controller.create);
router.patch('/:id', requireAuth, requireRole('ADMIN'), validate(updateQuizSchema), controller.update);
router.delete('/:id', requireAuth, requireRole('ADMIN'), controller.remove);

router.post('/:quizId/questions', requireAuth, requireRole('ADMIN'), validate(createQuestionSchema), controller.addQuestion);
router.patch('/:quizId/questions/:questionId', requireAuth, requireRole('ADMIN'), validate(updateQuestionSchema), controller.updateQuestion);
router.delete('/:quizId/questions/:questionId', requireAuth, requireRole('ADMIN'), controller.removeQuestion);

export default router;
