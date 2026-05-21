import prisma from '../lib/prisma.js';
import { notifyUsers } from '../lib/notifications.js';


export const listMine = async (req, res) => {
	try {
		const page = Math.max(1, parseInt(req.query.page || '1', 10));
		const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || '20', 10)));
		const unreadOnly = req.query.unreadOnly === 'true';

		const where = { userId: req.user.id };
		if (unreadOnly) where.isRead = false;

		const [total, rows, unreadCount] = await Promise.all([
			prisma.notification.count({ where }),
			prisma.notification.findMany({
				where,
				orderBy: { createdAt: 'desc' },
				skip: (page - 1) * limit,
				take: limit,
			}),
			prisma.notification.count({ where: { userId: req.user.id, isRead: false } }),
		]);

		return res.status(200).json({
			success: true,
			data: rows,
			pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
			meta: { unreadCount },
		});
	} catch (err) {
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};



export const markRead = async (req, res) => {
	try {
		const n = await prisma.notification.findUnique({ where: { id: req.params.id } });
		if (!n) {
			return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Notification not found' } });
		}
		if (n.userId !== req.user.id) {
			return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Insufficient permissions' } });
		}
		const updated = await prisma.notification.update({ where: { id: req.params.id }, data: { isRead: true } });
		return res.status(200).json({ success: true, data: updated });
	} catch (err) {
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};



export const markAllRead = async (req, res) => {
	try {
		await prisma.notification.updateMany({
			where: { userId: req.user.id, isRead: false },
			data: { isRead: true },
		});
		return res.status(200).json({ success: true, data: { ok: true } });
	} catch (err) {
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};



export const sendCustom = async (req, res) => {
	try {
		const { userIds, role, title, body } = req.body;

		let targets = userIds || [];
		if (!targets.length && role) {
			const users = await prisma.user.findMany({ where: { role, status: 'ACTIVE' }, select: { id: true } });
			targets = users.map((u) => u.id);
		}

		if (!targets.length) {
			return res.status(200).json({ success: true, data: { count: 0 } });
		}

		await notifyUsers(req.app, targets, { type: 'CUSTOM', title, body });

		return res.status(201).json({ success: true, data: { count: targets.length } });
	} catch (err) {
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};
