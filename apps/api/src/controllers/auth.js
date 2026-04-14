import prisma from '../lib/prisma.js';
import redis from '../lib/redis.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto'; //used to hash the reset tokens

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

// Cyndia — implement each function below
// every response must use the standard shape: { success, data } or { success, error }
// see docs/api/api_plan.md for the full conventions
//
// access token: sign with JWT_ACCESS_SECRET, 15min expiry
// refresh token: sign with JWT_REFRESH_SECRET, 7d expiry, store in Redis as key `refresh:<userId>`
// passwords: always hash with bcrypt before storing, never return password_hash in responses

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. find user by email
        const user = await prisma.user.findUnique({ where: { email }});
        if (!user || !user.passwordHash){
            return res.status(401).json({ success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password'}});
        }

        // 2. check password with bcrypt
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password'}});
        }

        // 3. check user status is ACTIVE — return 403 if INACTIVE or SUSPENDED
        if (user.status !== 'ACTIVE') {
            return res.status(403).json({ success: false, error: { code: 'ACCOUNT_INACTIVE', message: 'Account is not active'}});
        }

        // 4. sign access token + refresh token
        const payload = { id: user.id, role: user.role };
        const accessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });

        // 5. store refresh token in Redis
        await redis.set(`refresh:${user.id}`, refreshToken, 'EX', 7* 24* 60* 60);

        // 6. return access token in body, refresh token as HttpOnly cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', //true in prod, false in local dev
            sameSite: 'strict',
            maxAge: 7* 24* 60* 60* 1000 //7 days in milliseconds
        });

        return res.status(200).json({
            success: true,
            data: {
                accessToken,
                user: { id: user.id, email: user.email, role: user.role }
            }
        });
    } catch (err) {
        return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message }});
    }
};

export const refresh = async (req, res) => {
    try {
        // 1. read refresh token from HttpOnly cookie
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ success: false, error: { code: 'MISSING_TOKEN', message: 'No refresh token provided'}});
        }

        // 2. verify JWT signature first to get the user ID safely
        let decoded;
        try{
            decoded = jwt.verify(refreshToken, REFRESH_SECRET);
        } catch (err) {
            return res.status(401).json({ success: false, error: { code: 'INVALID_TOKEN', message: 'Refresh token is invalid or expired'}});
        }

        // 3. check it exists in Redis - return 401 if not
        const storedToken = await redis.get(`refresh:${decoded.id}`);
        if (!storedToken || storedToken !== refreshToken) {
            return res.status(401).json({ success: false, error: { code: 'INVALID_TOKEN', message: 'Refresh token has been revoked'}});
        }

        // 4. issue new access token, return in body
        const newAccessToken = jwt.sign({ id: decoded.id, role: decoded.role }, ACCESS_SECRET, { expiresIn: '15m' });

        return res.status(200).json({
            success: true,
            data: { accessToken: newAccessToken }
        });
    } catch (err) {
        return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message }});
    }
};

export const logout = async (req, res) => {
    try {
        // 1. delete refresh token from Redis (key: refresh:<req.user.id>)
        // req.user is available here because the route uses 'requireAuth' middleware
        await redis.del(`refresh:${req.user.id}`);

        // 2. clear the cookie
        res.clearCookie('refreshToken');

        // 3. return 204
        return res.status(204).send();
    } catch (err) {
        return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message }});
    }
};

export const setPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        // 1. find PasswordResetToken by token, check not expired
        // we hash the incoming token to match what's stored in the DB securely
        const tokenHash = hashToken(token);
        const resetRecord = await prisma.passwordResetToken.findFirst({
            where: { tokenHash: tokenHash, expiresAt: { gt: new Date()}}
        });

        if (!resetRecord) {
            return res.status(400).json({ success: false, error: { code: 'INVALID_TOKEN', message: 'Token is invalid or has expired'}});
        }

        // 2. hash new password with bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. update user: set password_hash, set status ACTIVE
        await prisma.user.update({
            where: { id: resetRecord.userId },
            data: { passwordHash: hashedPassword, status: 'ACTIVE' }
        });

        // 4. delete the PasswordResetToken row
        await prisma.passwordResetToken.delete({ where: { id: resetRecord.id }});

        return res.status(200).json({ success: true, data: { message: 'Password set successfully' }});
    } catch (err) {
        return res.status(500).json({ success: false, error:{ code: 'SERVER_ERROR', message: err.message }});
    }
};

export const resendActivation = async (req, res) => {
    try {
        const { email } = req.body;

        // 1. find user by email — must be INACTIVE, return 400 if already active
        const user = await prisma.user.findUnique({ where: { email }});
        if (!user || user.status !== 'INACTIVE') {
            return res.status(400).json({ success: false, error:{ code: 'BAD_REQUEST', message: 'Account is already active or does not exist'}});
        }

        // 2. delete existing PasswordResetToken for this user if any
        await prisma.passwordResetToken.deleteMany({ where: { user_id: user.id }});

        // 3. create new PasswordResetToken (24hr expiry)
        const plainToken = crypto.randomBytes(32).toString('hex');
        const tokenHash = hashToken(plainToken);

        await prisma.passwordResetToken.create({
            data: {
                userId: user.id,
                tokenHash: tokenHash,
                expiresAt: new Date(Date.now() + 24* 60* 60* 1000) //24 hours
            }
        });

        // 4. send activation email via SES (AWS), handle by Law, no need do anything here

        return res.status(200).json({ success: true, data: { message: 'Activation email resent' }});
    } catch (err) {
        return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message }});
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // 1. find user by email — if not found, return 200 anyway (Security: Don't leak which emails exist)
        const user = await prisma.user.findUnique({ where: { email }});

        if (user) {
            // 2. create PasswordResetToken (24hr expiry)
            const plainToken = crypto.randomBytes(32).toString('hex');
            const tokenHash = hashToken(plainToken);

            await prisma.passwordResetToken.create({
                data: {
                    userId: user.id,
                    tokenHash: tokenHash,
                    expiresAt: new Date(Date.now() + 24* 60* 60* 1000)
                }
            });

            // 3. send reset email via SES (AWS), handle by Law (updated), no need do anything here
        }

        // always return 200
        return res.status(200).json({ success: true, data: { message: 'If an account with that email exists, a reset link has been sent'}});
    } catch (err) {
        return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message }});
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        // 1. find PasswordResetToken by token, check not expired
        const tokenHash = hashToken(token);
        const resetRecord = await prisma.passwordResetToken.findFirst({ where: { tokenHash: tokenHash, expiresAt: { gt: new Date() }}});

        if (!resetRecord) {
            return res.status(400).json({ success: false, error: { code: 'INVALID_TOKEN', message: 'Token is invalid or has expired'}});
        }

        // 2. hash new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. update password_hash (No status change here since they are already ACTIVE)
        await prisma.user.update({
            where: { id: resetRecord.userId },
            data: { passwordHash: hashedPassword }
        });

        // 4. delete the PasswordResetToken row
        await prisma.passwordResetToken.delete({ where: { id: resetRecord.id }});

        return res.status(200).json({ success: true, data: { message: 'Password reset successfully'}});
    } catch (err) {
        return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message }});
    }  
};
