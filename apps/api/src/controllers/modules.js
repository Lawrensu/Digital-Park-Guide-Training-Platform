import prisma from '../lib/prisma.js';
import { notifyUsers } from '../lib/notifications.js';


export const list = async (req, res) => {
	try {
		const { status } = req.query;
		const page = Math.max(1, parseInt(req.query.page || '1', 10));
		const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || '20', 10)));

		const where = {};
		if (status) {
			where.status = status;
		} else if (req.user.role === 'GUIDE') {
			// guides only see published modules by default
			where.status = 'PUBLISHED';
		}

		const [total, rows] = await Promise.all([
			prisma.module.count({ where }),
			prisma.module.findMany({
				where,
				orderBy: { createdAt: 'desc' },
				skip: (page - 1) * limit,
				take: limit,
				include: {
					creator: { select: { id: true, username: true } },
					_count: { select: { contentItems: true, quizzes: true, enrolments: true } },
				},
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
		const module = await prisma.module.findUnique({
			where: { id: req.params.id },
			include: {
				creator: { select: { id: true, username: true } },
				contentItems: { orderBy: { order: 'asc' } },
				quizzes: { select: { id: true, title: true, passScorePct: true } },
			},
		});
		if (!module) {
			return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Module not found' } });
		}

		if (req.user.role === 'GUIDE' && module.status !== 'PUBLISHED') {
			return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Module is not published' } });
		}

		return res.status(200).json({ success: true, data: module });
	} catch (err) {
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};



export const create = async (req, res) => {
	try {
		const module = await prisma.module.create({
			data: {
				title: req.body.title,
				description: req.body.description,
				createdBy: req.user.id,
			},
		});
		return res.status(201).json({ success: true, data: module });
	} catch (err) {
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};



export const update = async (req, res) => {
	try {
		const existing = await prisma.module.findUnique({ where: { id: req.params.id } });
		if (!existing) {
			return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Module not found' } });
		}

		const module = await prisma.module.update({
			where: { id: req.params.id },
			data: req.body,
		});
		return res.status(200).json({ success: true, data: module });
	} catch (err) {
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};



export const setStatus = async (req, res) => {
	try {
		const existing = await prisma.module.findUnique({ where: { id: req.params.id } });
		if (!existing) {
			return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Module not found' } });
		}

		const { status } = req.body;
		const wasPublished = existing.status === 'PUBLISHED';
		const willPublish = status === 'PUBLISHED';

		const module = await prisma.module.update({ where: { id: req.params.id }, data: { status } });

		// notify guides only on first publish
		if (!wasPublished && willPublish) {
			const guides = await prisma.user.findMany({
				where: { role: 'GUIDE', status: 'ACTIVE' },
				select: { id: true },
			});
			notifyUsers(req.app, guides.map((g) => g.id), {
				type: 'MODULE_PUBLISHED',
				title: 'New module available',
				body: `A new module is available: ${module.title}`,
				referenceId: module.id,
				referenceType: 'module',
			});
		}

		return res.status(200).json({ success: true, data: module });
	} catch (err) {
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};



export const remove = async (req, res) => {
	try {
		const existing = await prisma.module.findUnique({
			where: { id: req.params.id },
			include: { _count: { select: { enrolments: true, certifications: true } } },
		});
		if (!existing) {
			return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Module not found' } });
		}

		// guard destructive delete; prefer archiving once any usage exists
		if (existing._count.enrolments > 0 || existing._count.certifications > 0) {
			return res.status(409).json({ success: false, error: { code: 'CONFLICT', message: 'Cannot delete a module with enrolments or certifications; archive it instead' } });
		}

		await prisma.module.delete({ where: { id: req.params.id } });
		return res.status(204).send();
	} catch (err) {
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};
