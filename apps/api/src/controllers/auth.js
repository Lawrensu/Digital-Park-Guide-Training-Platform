import prisma from '../lib/prisma.js';
import redis from '../lib/redis.js';

// Cyndia — implement each function below
// every response must use the standard shape: { success, data } or { success, error }
// see docs/api/api_plan.md for the full conventions
//
// access token: sign with JWT_ACCESS_SECRET, 15min expiry
// refresh token: sign with JWT_REFRESH_SECRET, 7d expiry, store in Redis as key `refresh:<userId>`
// passwords: always hash with bcrypt before storing, never return password_hash in responses

export const login = async (req, res) => {
    // 1. find user by email
    // 2. check password with bcrypt
    // 3. check user status is ACTIVE — return 403 if INACTIVE or SUSPENDED
    // 4. sign access token + refresh token
    // 5. store refresh token in Redis
    // 6. return access token in body, refresh token as HttpOnly cookie
};


export const refresh = async (req, res) => {
    // 1. read refresh token from HttpOnly cookie
    // 2. check it exists in Redis — return 401 if not
    // 3. verify JWT signature
    // 4. issue new access token, return in body
};


export const logout = async (req, res) => {
    // 1. delete refresh token from Redis (key: refresh:<req.user.id>)
    // 2. clear the cookie
    // 3. return 204
};


export const setPassword = async (req, res) => {
    // used for first-time account activation (guide sets their password via email link)
    // 1. find PasswordResetToken by token, check not expired
    // 2. hash new password with bcrypt
    // 3. update user: set password_hash, set status ACTIVE
    // 4. delete the PasswordResetToken row
};


export const resendActivation = async (req, res) => {
    // 1. find user by email — must be INACTIVE, return 400 if already active
    // 2. delete existing PasswordResetToken for this user if any
    // 3. create new PasswordResetToken (24hr expiry)
    // 4. send activation email via SES — ask Law for the email utility
};


export const forgotPassword = async (req, res) => {
    // always return 200 regardless of whether the email exists (don't leak user existence)
    // 1. find user by email — if not found, return 200 anyway
    // 2. create PasswordResetToken (24hr expiry)
    // 3. send reset email via SES
};


export const resetPassword = async (req, res) => {
    // same as setPassword but user is already ACTIVE
    // 1. find PasswordResetToken by token, check not expired
    // 2. hash new password
    // 3. update password_hash
    // 4. delete the PasswordResetToken row
};
