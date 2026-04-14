import prisma from '../lib/prisma.js';
import redis from '../lib/redis.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendActivationEmail, sendPasswordResetEmail } from '../lib/email.js';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');


export const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await prisma.user.findUnique({ where: { email } });
		if (!user || !user.passwordHash) {
			return res.status(401).json({ success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } });
		}

		const isMatch = await bcrypt.compare(password, user.passwordHash);
		if (!isMatch) {
			return res.status(401).json({ success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } });
		}

		if (user.status !== 'ACTIVE') {
			return res.status(403).json({ success: false, error: { code: 'ACCOUNT_INACTIVE', message: 'Account is not active' } });
		}

		const payload = { id: user.id, role: user.role };
		const accessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: '15m' });
		const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });

		await redis.set(`refresh:${user.id}`, refreshToken, 'EX', 7 * 24 * 60 * 60);

		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 7 * 24 * 60 * 60 * 1000
		});

		return res.status(200).json({
			success: true,
			data: {
				accessToken,
				user: { id: user.id, email: user.email, role: user.role }
			}
		});
	} catch (err) {
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};


export const refresh = async (req, res) => {
	try {
		const refreshToken = req.cookies.refreshToken;
		if (!refreshToken) {
			return res.status(401).json({ success: false, error: { code: 'MISSING_TOKEN', message: 'No refresh token provided' } });
		}

		let decoded;
		try {
			decoded = jwt.verify(refreshToken, REFRESH_SECRET);
		} catch (err) {
			return res.status(401).json({ success: false, error: { code: 'INVALID_TOKEN', message: 'Refresh token is invalid or expired' } });
		}

		const storedToken = await redis.get(`refresh:${decoded.id}`);
		if (!storedToken || storedToken !== refreshToken) {
			return res.status(401).json({ success: false, error: { code: 'INVALID_TOKEN', message: 'Refresh token has been revoked' } });
		}

		const newAccessToken = jwt.sign({ id: decoded.id, role: decoded.role }, ACCESS_SECRET, { expiresIn: '15m' });

		return res.status(200).json({
			success: true,
			data: { accessToken: newAccessToken }
		});
	} catch (err) {
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};


export const logout = async (req, res) => {
	try {
		await redis.del(`refresh:${req.user.id}`);
		res.clearCookie('refreshToken');
		return res.status(204).send();
	} catch (err) {
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};


export const setPassword = async (req, res) => {
	try {
		const { token, password } = req.body;

		const tokenHash = hashToken(token);
		const resetRecord = await prisma.passwordResetToken.findFirst({
			where: { tokenHash, expiresAt: { gt: new Date() } }
		});

		if (!resetRecord) {
			return res.status(400).json({ success: false, error: { code: 'INVALID_TOKEN', message: 'Token is invalid or has expired' } });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		await prisma.user.update({
			where: { id: resetRecord.userId },
			data: { passwordHash: hashedPassword, status: 'ACTIVE' }
		});

		await prisma.passwordResetToken.delete({ where: { id: resetRecord.id } });

		return res.status(200).json({ success: true, data: { message: 'Password set successfully' } });
	} catch (err) {
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};


export const resendActivation = async (req, res) => {
	try {
		const { email } = req.body;

		const user = await prisma.user.findUnique({ where: { email } });
		if (!user || user.status !== 'INACTIVE') {
			return res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'Account is already active or does not exist' } });
		}

		await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

		const plainToken = crypto.randomBytes(32).toString('hex');
		const tokenHash = hashToken(plainToken);

		await prisma.passwordResetToken.create({
			data: {
				userId: user.id,
				tokenHash,
				expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
			}
		});

		const activationUrl = `${process.env.WEB_URL}/activate?token=${plainToken}`;
		await sendActivationEmail(user.email, user.firstName, activationUrl);

		return res.status(200).json({ success: true, data: { message: 'Activation email resent' } });
	} catch (err) {
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};


export const forgotPassword = async (req, res) => {
	try {
		const { email } = req.body;

		const user = await prisma.user.findUnique({ where: { email } });

		if (user) {
			const plainToken = crypto.randomBytes(32).toString('hex');
			const tokenHash = hashToken(plainToken);

			await prisma.passwordResetToken.create({
				data: {
					userId: user.id,
					tokenHash,
					expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
				}
			});

			const resetUrl = `${process.env.WEB_URL}/reset-password?token=${plainToken}`;
			await sendPasswordResetEmail(user.email, resetUrl);
		}

		// always return 200 — don't leak whether the email exists
		return res.status(200).json({ success: true, data: { message: 'If an account with that email exists, a reset link has been sent' } });
	} catch (err) {
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};


export const resetPassword = async (req, res) => {
	try {
		const { token, password } = req.body;

		const tokenHash = hashToken(token);
		const resetRecord = await prisma.passwordResetToken.findFirst({
			where: { tokenHash, expiresAt: { gt: new Date() } }
		});

		if (!resetRecord) {
			return res.status(400).json({ success: false, error: { code: 'INVALID_TOKEN', message: 'Token is invalid or has expired' } });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		await prisma.user.update({
			where: { id: resetRecord.userId },
			data: { passwordHash: hashedPassword }
		});

		await prisma.passwordResetToken.delete({ where: { id: resetRecord.id } });

		return res.status(200).json({ success: true, data: { message: 'Password reset successfully' } });
	} catch (err) {
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};
