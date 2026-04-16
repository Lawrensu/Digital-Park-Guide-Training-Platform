import { Router } from 'express';
import requireInternalSecret from '../middleware/requireInternalSecret.js';
import validate from '../middleware/validate.js';
import { ingestAlertSchema } from '../schemas/iotAlerts.js';
import * as controller from '../controllers/iotAlerts.js';

// mounted outside /api; protected by internal secret header rather than JWT
const router = Router();

router.post('/iot-alerts', requireInternalSecret, validate(ingestAlertSchema), controller.ingest);

export default router;
