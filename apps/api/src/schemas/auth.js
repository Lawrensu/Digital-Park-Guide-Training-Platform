import { z } from 'zod';

// Cyndia — define the shape of each request body here
// these get passed into validate() in routes/auth.js
// refer to docs/api/api_plan.md for what each endpoint expects

//This regex enforces: min 8 chars, at least 1 uppercase, 1 lowercase, 1 number
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
//This regex enforces exactly 64 hexadecimal characters
const tokenPattern = /^[a-f0-9]{64}$/

export const loginSchema = z.object({
    email: z.string().trim().email("Must be a valid email"),
    password: z.string().min(1, "Password is required")
});

export const setPasswordSchema = z.object({
    token: z.string().regex(tokenPattern, "Invalid token format"),
    password: z.string().regex(passwordPattern, "Password must be at least 8 characters, and include 1 uppercase letter, 1 lowercase letter, and 1 number")
});

export const forgotPasswordSchema = z.object({
    email: z.string().trim().email("Must be a valid email")
});

export const resetPasswordSchema = z.object({
    token: z.string().regex(tokenPattern, "Invalid token format"),
    password: z.string().regex(passwordPattern, "Password must be at least 8 characters, and include 1 uppercase letter, 1 lowercase letter, and 1 number")
});

export const resendActivationSchema = z.object({
    email: z.string().trim().email("Must be a valid email")
});