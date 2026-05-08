import prisma from '../lib/prisma.js';
import { uploadBuffer, getPresignedDownloadUrl } from '../lib/s3.js';
import { generateCertificatePdf } from '../lib/certificatePdf.js';
import { checkAndAwardBadges } from '../lib/badges.js';
import { notifyUsers } from '../lib/notifications.js';


export const issue = async (req, res) => {
	try {
		const { guideId, quizAttemptId, moduleId, companyName, issuerName, issuerTitle, issueDate, expiryDate } = req.body;

		const [guide, module, attempt] = await Promise.all([
			prisma.user.findUnique({ where: { id: guideId } }),
			prisma.module.findUnique({ where: { id: moduleId } }),
			prisma.quizAttempt.findUnique({ where: { id: quizAttemptId }, include: { quiz: true } }),
		]);

		if (!guide || guide.role !== 'GUIDE') {
			return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Guide not found' } });
		}
		if (!module) {
			return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Module not found' } });
		}
		if (!attempt || attempt.guideId !== guideId || attempt.status !== 'GRADED') {
			return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Quiz attempt must be graded and belong to this guide' } });
		}

		// verify the attempt passed
		const passScore = (Number(attempt.quiz.passScorePct) / 100) *
			(await prisma.question.aggregate({ where: { quizId: attempt.quizId }, _sum: { maxScore: true } }))._sum.maxScore;
		if (Number(attempt.totalScore) < Number(passScore)) {
			return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Attempt did not meet the passing score' } });
		}

		const existing = await prisma.certification.findFirst({ where: { guideId, moduleId } });
		if (existing) {
			return res.status(409).json({ success: false, error: { code: 'CONFLICT', message: 'Guide already has a certification for this module' } });
		}

		// create DB row first so we have an id for the PDF; then upload and update the key
		const cert = await prisma.certification.create({
			data: {
				guideId, quizAttemptId, moduleId, companyName, issuerName, issuerTitle,
				issueDate: new Date(issueDate),
				expiryDate: expiryDate ? new Date(expiryDate) : null,
				pdfS3Key: 'pending',
				issuedBy: req.user.id,
			},
		});

		const s3Key = `certifications/${cert.id}.pdf`;
		const verifyUrl = `${process.env.WEB_URL}/verify/${cert.id}`;

		try {
			const pdfBuffer = await generateCertificatePdf({
				certificationId: cert.id,
				guideName: guide.username,
				moduleTitle: module.title,
				companyName, issuerName, issuerTitle,
				issueDate, expiryDate,
				verifyUrl,
			});

			await uploadBuffer(s3Key, Buffer.from(pdfBuffer), 'application/pdf');

			await prisma.certification.update({ where: { id: cert.id }, data: { pdfS3Key: s3Key } });
		} catch (err) {
			// roll back on PDF/upload failure so we don't keep orphaned certs
			await prisma.certification.delete({ where: { id: cert.id } });
			throw err;
		}

		notifyUsers(req.app, [guideId], {
			type: 'CERTIFICATE_APPROVED',
			title: 'Certificate issued',
			body: `Your certificate for "${module.title}" has been issued`,
			referenceId: cert.id,
			referenceType: 'certification',
		});

		checkAndAwardBadges(guideId);

		return res.status(201).json({ success: true, data: { ...cert, pdfS3Key: s3Key } });
	} catch (err) {
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};



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
		}
		if (moduleId) where.moduleId = moduleId;

		const [total, rows] = await Promise.all([
			prisma.certification.count({ where }),
			prisma.certification.findMany({
				where,
				orderBy: { createdAt: 'desc' },
				skip: (page - 1) * limit,
				take: limit,
				include: {
					module: { select: { id: true, title: true } },
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
		const cert = await prisma.certification.findUnique({
			where: { id: req.params.id },
			include: {
				module: { select: { id: true, title: true } },
				guide: { select: { id: true, username: true } },
			},
		});
		if (!cert) {
			return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Certification not found' } });
		}
		if (req.user.role === 'GUIDE' && cert.guideId !== req.user.id) {
			return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Insufficient permissions' } });
		}
		return res.status(200).json({ success: true, data: cert });
	} catch (err) {
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};



export const download = async (req, res) => {
	try {
		const cert = await prisma.certification.findUnique({ where: { id: req.params.id } });
		if (!cert) {
			return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Certification not found' } });
		}

		if (req.user.role === 'GUIDE' && cert.guideId !== req.user.id) {
			return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Insufficient permissions' } });
		}

		const url = await getPresignedDownloadUrl(cert.pdfS3Key, 900);
		return res.status(200).json({ success: true, data: { url } });
	} catch (err) {
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};



// public verify; no auth required
export const verify = async (req, res) => {
	try {
		const cert = await prisma.certification.findUnique({
			where: { id: req.params.id },
			include: {
				module: { select: { title: true } },
				guide: { select: { username: true } },
			},
		});
		if (!cert) {
			return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Certification not found' } });
		}

		const isExpired = cert.expiryDate && new Date(cert.expiryDate) < new Date();

		return res.status(200).json({
			success: true,
			data: {
				id: cert.id,
				guideName: cert.guide.username,
				moduleTitle: cert.module.title,
				companyName: cert.companyName,
				issuerName: cert.issuerName,
				issueDate: cert.issueDate,
				expiryDate: cert.expiryDate,
				status: isExpired ? 'EXPIRED' : 'VALID',
			},
		});
	} catch (err) {
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};
