import prisma from '../lib/prisma.js';


export const list = async (req, res) => {
	try {
		const { guideId, moduleId } = req.query;
		const page = Math.max(1, parseInt(req.query.page || '1', 10));
		const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || '20', 10)));

		const where = {};
		if (req.user.role === 'GUIDE') {
			where.guideId = req.user.id;
		} else {
			if (guideId) where.guideId = guideId;
			if (moduleId) where.moduleId = moduleId;
		}

		const [total, rows] = await Promise.all([
			prisma.enrolment.count({ where }),
			prisma.enrolment.findMany({
				where,
				orderBy: { enrolledAt: 'desc' },
				skip: (page - 1) * limit,
				take: limit,
				include: {
					module: { select: { id: true, title: true, status: true } },
					guide: { select: { id: true, username: true, email: true } },
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



// admin enrols a specific guide
export const create = async (req, res) => {
	try {
		const { guideId, moduleId, dueAt } = req.body;

		const guide = await prisma.user.findUnique({ where: { id: guideId } });
		if (!guide || guide.role !== 'GUIDE') {
			return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Guide not found' } });
		}
		const module = await prisma.module.findUnique({ where: { id: moduleId } });
		if (!module) {
			return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Module not found' } });
		}

		const enrolment = await prisma.enrolment.create({
			data: { guideId, moduleId, dueAt: dueAt ? new Date(dueAt) : null },
		});
		return res.status(201).json({ success: true, data: enrolment });
	} catch (err) {
		if (err.code === 'P2002') {
			return res.status(409).json({ success: false, error: { code: 'CONFLICT', message: 'Guide is already enrolled in this module' } });
		}
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};



// guide self enrolls in a published module
export const selfEnrol = async (req, res) => {
	try {
		const { moduleId } = req.body;
		const guideId = req.user.id;

		const module = await prisma.module.findUnique({ where: { id: moduleId } });
		if (!module) {
			return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Module not found' } });
		}
		if (module.status !== 'PUBLISHED') {
			return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Module is not available for enrolment' } });
		}

		const enrolment = await prisma.enrolment.create({
			data: { guideId, moduleId },
		});
		return res.status(201).json({ success: true, data: enrolment });
	} catch (err) {
		if (err.code === 'P2002') {
			return res.status(409).json({ success: false, error: { code: 'CONFLICT', message: 'You are already enrolled in this module' } });
		}
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};



export const update = async (req, res) => {
	try {
		const existing = await prisma.enrolment.findUnique({ where: { id: req.params.id } });
		if (!existing) {
			return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Enrolment not found' } });
		}

		const enrolment = await prisma.enrolment.update({
			where: { id: req.params.id },
			data: { dueAt: req.body.dueAt ? new Date(req.body.dueAt) : null },
		});
		return res.status(200).json({ success: true, data: enrolment });
	} catch (err) {
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};



export const remove = async (req, res) => {
	try {
		await prisma.enrolment.delete({ where: { id: req.params.id } });
		return res.status(204).send();
	} catch (err) {
		if (err.code === 'P2025') {
			return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Enrolment not found' } });
		}
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};
