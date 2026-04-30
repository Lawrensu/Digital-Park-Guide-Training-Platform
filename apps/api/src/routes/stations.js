import { Router } from 'express';
import requireAuth from '../middleware/requireAuth.js';
import requireRole from '../middleware/requireRole.js';
import validate from '../middleware/validate.js';
import { createStationSchema, updateStationSchema } from '../schemas/stations.js';
import * as stationsController from '../controllers/stations.js';

const router = Router();

// all station routes are admin only
router.get('/', requireAuth, requireRole('ADMIN'), stationsController.list);
router.post('/', requireAuth, requireRole('ADMIN'), validate(createStationSchema), stationsController.create);
router.get('/:id', requireAuth, requireRole('ADMIN'), stationsController.getOne);
router.patch('/:id', requireAuth, requireRole('ADMIN'), validate(updateStationSchema), stationsController.update);
router.delete('/:id', requireAuth, requireRole('ADMIN'), stationsController.remove);

export default router;
