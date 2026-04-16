import { Router } from 'express';
import requireAuth from '../middleware/requireAuth.js';
import requireRole from '../middleware/requireRole.js';
import validate from '../middleware/validate.js';
import { syncBatchSchema } from '../schemas/sync.js';
import * as controller from '../controllers/sync.js';

const router = Router();

router.post('/', requireAuth, requireRole('GUIDE'), validate(syncBatchSchema), controller.batch);

export default router;
