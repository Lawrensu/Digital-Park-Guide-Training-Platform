import prisma from '../lib/prisma.js';
import { notifyAllAdmins } from '../lib/notifications.js';


// internal ingest: called by ESP32 or gateway using the internal secret header
export const ingest = async (req, res) => {
	try {
		const { deviceIdentifier, detectionType, confidence, evidenceS3Key, detectedAt } = req.body;

		const device = await prisma.ioTDevice.findUnique({
			where: { deviceIdentifier },
			include: { currentGuide: true },
		});
		if (!device) {
			return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Device not found' } });
		}
		if (!device.currentGuideId) {
			return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Device is not assigned to a guide' } });
		}

		const alert = await prisma.ioTAlert.create({
			data: {
				deviceId: device.id,
				guideId: device.currentGuideId,
				detectionType,
				confidence,
				evidenceS3Key,
				detectedAt: new Date(detectedAt),
			},
		});

		// real time broadcast to connected admins via Socket.io
		const io = req.app.get?.('io');
		if (io) {
			io.to('admins').emit('iot:alert', {
				id: alert.id,
				deviceIdentifier,
				guideId: device.currentGuideId,
				detectionType,
				confidence: Number(confidence),
				detectedAt: alert.detectedAt,
			});
		}

		notifyAllAdmins(req.app, {
			type: 'IOT_ALERT',
			title: 'New IoT alert',
			body: `${detectionType} detected with ${Math.round(Number(confidence) * 100)}% confidence`,
			referenceId: alert.id,
			referenceType: 'iot_alert',
		});

		return res.status(201).json({ success: true, data: { id: alert.id } });
	} catch (err) {
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};



export const list = async (req, res) => {
	try {
		const { deviceId, guideId, status, detectionType } = req.query;
		const page = Math.max(1, parseInt(req.query.page || '1', 10));
		const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || '20', 10)));

		const where = {};
		if (deviceId) where.deviceId = deviceId;
		if (guideId) where.guideId = guideId;
		if (status) where.status = status;
		if (detectionType) where.detectionType = detectionType;

		const [total, rows] = await Promise.all([
			prisma.ioTAlert.count({ where }),
			prisma.ioTAlert.findMany({
				where,
				orderBy: { detectedAt: 'desc' },
				skip: (page - 1) * limit,
				take: limit,
				include: {
					device: { select: { id: true, deviceIdentifier: true } },
					guide: { select: { id: true, username: true } },
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
		const alert = await prisma.ioTAlert.findUnique({
			where: { id: req.params.id },
			include: {
				device: true,
				guide: { select: { id: true, username: true } },
				flagger: { select: { id: true, username: true } },
			},
		});
		if (!alert) {
			return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Alert not found' } });
		}
		return res.status(200).json({ success: true, data: alert });
	} catch (err) {
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};



export const flag = async (req, res) => {
	try {
		const alert = await prisma.ioTAlert.findUnique({ where: { id: req.params.id } });
		if (!alert) {
			return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Alert not found' } });
		}
		if (alert.status !== 'PENDING') {
			return res.status(409).json({ success: false, error: { code: 'CONFLICT', message: 'Alert already reviewed' } });
		}

		const updated = await prisma.ioTAlert.update({
			where: { id: req.params.id },
			data: {
				status: req.body.status,
				flaggedBy: req.user.id,
				flaggedAt: new Date(),
			},
		});
		return res.status(200).json({ success: true, data: updated });
	} catch (err) {
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};
