import { Router } from 'express';
import requireAuth from '../middleware/requireAuth.js';
import requireRole from '../middleware/requireRole.js';
import validate from '../middleware/validate.js';
import { initiatePaymentSchema } from '../schemas/payments.js';
import * as paymentsController from '../controllers/payments.js';

const router = Router();

router.post('/initiate', requireAuth, requireRole('GUIDE'), validate(initiatePaymentSchema), paymentsController.initiate);

// BillPlz calls this webhook directly; no JWT auth, payload verified by X Signature
router.post('/callback', paymentsController.callback);

export default router;
