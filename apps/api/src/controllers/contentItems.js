import prisma from '../lib/prisma.js';


export const listByModule = async (req, res) => {
	try {
		const items = await prisma.contentItem.findMany({
			where: { moduleId: req.params.moduleId },
			orderBy: { order: 'asc' },
		});
		return res.status(200).json({ success: true, data: items });
	} catch (err) {
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};



export const create = async (req, res) => {
	try {
		const { moduleId } = req.params;
		const module = await prisma.module.findUnique({ where: { id: moduleId } });
		if (!module) {
			return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Module not found' } });
		}

		let nextOrder = req.body.order;
		if (nextOrder === undefined) {
			const last = await prisma.contentItem.findFirst({
				where: { moduleId },
				orderBy: { order: 'desc' },
			});
			nextOrder = last ? last.order + 1 : 0;
		}

		const item = await prisma.contentItem.create({
			data: { ...req.body, moduleId, order: nextOrder },
		});
		return res.status(201).json({ success: true, data: item });
	} catch (err) {
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};



export const update = async (req, res) => {
	try {
		const existing = await prisma.contentItem.findUnique({ where: { id: req.params.id } });
		if (!existing) {
			return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Content item not found' } });
		}

		const item = await prisma.contentItem.update({ where: { id: req.params.id }, data: req.body });
		return res.status(200).json({ success: true, data: item });
	} catch (err) {
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};



export const reorder = async (req, res) => {
	try {
		const { moduleId } = req.params;
		const { items } = req.body;

		const ids = items.map((i) => i.id);
		const found = await prisma.contentItem.findMany({
			where: { id: { in: ids }, moduleId },
			select: { id: true },
		});
		if (found.length !== items.length) {
			return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'One or more items do not belong to this module' } });
		}

		await prisma.$transaction(
			items.map((i) => prisma.contentItem.update({ where: { id: i.id }, data: { order: i.order } })),
		);

		return res.status(200).json({ success: true, data: { moduleId, count: items.length } });
	} catch (err) {
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};



export const remove = async (req, res) => {
	try {
		await prisma.contentItem.delete({ where: { id: req.params.id } });
		return res.status(204).send();
	} catch (err) {
		if (err.code === 'P2025') {
			return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Content item not found' } });
		}
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};
