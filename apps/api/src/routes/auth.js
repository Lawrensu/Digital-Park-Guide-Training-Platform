import { Router } from 'express';
import requireAuth from '../middleware/requireAuth.js';
import validate from '../middleware/validate.js';
import rateLimit from '../middleware/rateLimit.js';
import * as authController from '../controllers/auth.js';
import {
    loginSchema,
    setPasswordSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    resendActivationSchema,
} from '../schemas/auth.js';

const router = Router();

const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5 });

router.post('/login', loginLimiter, validate(loginSchema), authController.login);
router.post('/refresh', loginLimiter, authController.refresh);
router.post('/logout', requireAuth, authController.logout);
router.post('/set-password', authLimiter, validate(setPasswordSchema), authController.setPassword);
router.post('/resend-activation', authLimiter, validate(resendActivationSchema), authController.resendActivation);
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', authLimiter, validate(resetPasswordSchema), authController.resetPassword);

export default router;
