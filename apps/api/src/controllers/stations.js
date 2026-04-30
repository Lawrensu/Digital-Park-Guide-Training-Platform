import prisma from '../lib/prisma.js';


export const list = async (req, res) => {
	try {
		const stations = await prisma.station.findMany({ orderBy: { name: 'asc' } });
		return res.status(200).json({ success: true, data: stations });
	} catch (err) {
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};


export const create = async (req, res) => {
	try {
		const station = await prisma.station.create({ data: { name: req.body.name } });
		return res.status(201).json({ success: true, data: station });
	} catch (err) {
		if (err.code === 'P2002') {
			return res.status(409).json({ success: false, error: { code: 'CONFLICT', message: 'A station with that name already exists' } });
		}
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};


export const getOne = async (req, res) => {
	try {
		const station = await prisma.station.findUnique({ where: { id: req.params.id } });
		if (!station) {
			return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Station not found' } });
		}
		return res.status(200).json({ success: true, data: station });
	} catch (err) {
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};


export const update = async (req, res) => {
	try {
		const existing = await prisma.station.findUnique({ where: { id: req.params.id } });
		if (!existing) {
			return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Station not found' } });
		}

		const station = await prisma.station.update({
			where: { id: req.params.id },
			data: { name: req.body.name }
		});
		return res.status(200).json({ success: true, data: station });
	} catch (err) {
		if (err.code === 'P2002') {
			return res.status(409).json({ success: false, error: { code: 'CONFLICT', message: 'A station with that name already exists' } });
		}
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};


export const remove = async (req, res) => {
	try {
		const assignedCount = await prisma.user.count({ where: { stationId: req.params.id } });
		if (assignedCount > 0) {
			return res.status(409).json({ success: false, error: { code: 'CONFLICT', message: 'Cannot delete station while guides are assigned to it' } });
		}

		await prisma.station.delete({ where: { id: req.params.id } });
		return res.status(204).send();
	} catch (err) {
		if (err.code === 'P2025') {
			return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Station not found' } });
		}
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};
