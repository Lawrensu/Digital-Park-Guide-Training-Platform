import crypto from 'crypto';
import prisma from '../lib/prisma.js';
import { sendActivationEmail } from '../lib/email.js';


const USER_SELECT = {
	id: true,
	role: true,
	username: true,
	email: true,
	icPassportNumber: true,
	status: true,
	stationId: true,
	startDate: true,
	applicationId: true,
	createdAt: true,
	updatedAt: true,
	station: { select: { id: true, name: true } },
};



async function generateUniqueUsername(firstName, lastName) {
	const base = (firstName + lastName).toLowerCase().replace(/[^a-z0-9]/g, '');
	let candidate = base;
	let suffix = 0;
	while (suffix < 1000) {
		const exists = await prisma.user.findUnique({ where: { username: candidate } });
		if (!exists) return candidate;
		suffix += 1;
		candidate = `${base}${suffix}`;
	}
	return `${base}${crypto.randomBytes(3).toString('hex')}`;
}



export const list = async (req, res) => {
	try {
		const { role, status, stationId } = req.query;
		const page = Math.max(1, parseInt(req.query.page || '1', 10));
		const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || '20', 10)));

		const where = {};
		if (role) where.role = role;
		if (status) where.status = status;
		if (stationId) where.stationId = stationId;

		const [total, rows] = await Promise.all([
			prisma.user.count({ where }),
			prisma.user.findMany({
				where,
				select: USER_SELECT,
				orderBy: { createdAt: 'desc' },
				skip: (page - 1) * limit,
				take: limit,
			}),
		]);

		return res.status(200).json({
			success: true,
			data: rows,
			pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
		});
	} catch (err) {
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};



export const getOne = async (req, res) => {
	try {
		const isSelf = req.user.id === req.params.id;
		const isAdmin = req.user.role === 'ADMIN';
		if (!isSelf && !isAdmin) {
			return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Insufficient permissions' } });
		}

		const user = await prisma.user.findUnique({ where: { id: req.params.id }, select: USER_SELECT });
		if (!user) {
			return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found' } });
		}
		return res.status(200).json({ success: true, data: user });
	} catch (err) {
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};



export const update = async (req, res) => {
	try {
		const target = await prisma.user.findUnique({ where: { id: req.params.id } });
		if (!target) {
			return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found' } });
		}

		const data = {};
		if (req.body.stationId !== undefined) data.stationId = req.body.stationId;
		if (req.body.startDate !== undefined) data.startDate = req.body.startDate ? new Date(req.body.startDate) : null;
		if (req.body.email !== undefined) data.email = req.body.email;

		const user = await prisma.user.update({ where: { id: req.params.id }, data, select: USER_SELECT });
		return res.status(200).json({ success: true, data: user });
	} catch (err) {
		if (err.code === 'P2002') {
			return res.status(409).json({ success: false, error: { code: 'CONFLICT', message: 'Email is already in use' } });
		}
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};



export const updateStatus = async (req, res) => {
	try {
		const target = await prisma.user.findUnique({ where: { id: req.params.id } });
		if (!target) {
			return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found' } });
		}

		const user = await prisma.user.update({
			where: { id: req.params.id },
			data: { status: req.body.status },
			select: USER_SELECT,
		});
		return res.status(200).json({ success: true, data: user });
	} catch (err) {
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};



export const createAdmin = async (req, res) => {
	try {
		const { firstName, lastName, email } = req.body;

		const existing = await prisma.user.findUnique({ where: { email } });
		if (existing) {
			return res.status(409).json({ success: false, error: { code: 'CONFLICT', message: 'An account with this email already exists' } });
		}

		const username = await generateUniqueUsername(firstName, lastName);
		const rawToken = crypto.randomBytes(32).toString('hex');
		const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
		const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

		const user = await prisma.$transaction(async (tx) => {
			const u = await tx.user.create({
				data: {
					role: 'ADMIN',
					username,
					email,
					status: 'INACTIVE',
				},
			});
			await tx.passwordResetToken.create({
				data: { userId: u.id, tokenHash, expiresAt },
			});
			return u;
		});

		const activationUrl = `${process.env.WEB_URL}/set-password?token=${rawToken}`;
		sendActivationEmail(email, `${firstName} ${lastName}`, activationUrl);

		return res.status(201).json({ success: true, data: { userId: user.id, username } });
	} catch (err) {
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};
