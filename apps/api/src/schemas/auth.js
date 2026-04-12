import { z } from 'zod';

// Cyndia — define the shape of each request body here
// these get passed into validate() in routes/auth.js
// refer to docs/api/api_plan.md for what each endpoint expects

export const loginSchema = z.object({
    // TODO
});

export const setPasswordSchema = z.object({
    // TODO
});

export const forgotPasswordSchema = z.object({
    // TODO
});

export const resetPasswordSchema = z.object({
    // TODO
});

export const resendActivationSchema = z.object({
    // TODO
});
