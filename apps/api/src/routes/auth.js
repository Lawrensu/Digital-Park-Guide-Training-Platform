import { Router } from 'express';
import requireAuth from '../middleware/requireAuth.js';
import validate from '../middleware/validate.js';
import * as authController from '../controllers/auth.js';
import {
    loginSchema,
    setPasswordSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    resendActivationSchema,
} from '../schemas/auth.js';

const router = Router();

// routes are wired up; implement controller functions and schemas
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', requireAuth, authController.logout);
router.post('/set-password', validate(setPasswordSchema), authController.setPassword);
router.post('/resend-activation', validate(resendActivationSchema), authController.resendActivation);
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);

export default router;
