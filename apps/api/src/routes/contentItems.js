import { Router } from 'express';
import requireAuth from '../middleware/requireAuth.js';
import requireRole from '../middleware/requireRole.js';
import validate from '../middleware/validate.js';
import {
	createContentItemSchema,
	updateContentItemSchema,
	reorderContentItemsSchema,
} from '../schemas/contentItems.js';
import * as controller from '../controllers/contentItems.js';

// mergeParams so the moduleId route param is accessible in this nested router
const router = Router({ mergeParams: true });

router.get('/', requireAuth, controller.listByModule);
router.post('/', requireAuth, requireRole('ADMIN'), validate(createContentItemSchema), controller.create);
router.patch('/reorder', requireAuth, requireRole('ADMIN'), validate(reorderContentItemsSchema), controller.reorder);
router.get('/:id/image-url', requireAuth, controller.getImageUrl);
router.patch('/:id', requireAuth, requireRole('ADMIN'), validate(updateContentItemSchema), controller.update);
router.delete('/:id', requireAuth, requireRole('ADMIN'), controller.remove);

export default router;
