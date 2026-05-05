import crypto from 'crypto';
import prisma from '../lib/prisma.js';
import { sendActivationEmail, sendRegistrationRejectedEmail } from '../lib/email.js';
import { notifyAllAdmins } from '../lib/notifications.js';


// generate unique username from first + last name, appending numeric suffix on collision
async function generateUniqueUsername(firstName, lastName) {
	const base = (firstName + lastName).toLowerCase().replace(/[^a-z0-9]/g, '');
	let candidate = base;
	let suffix = 0;
	// cap attempts to avoid pathological loops
	while (suffix < 1000) {
		const exists = await prisma.user.findUnique({ where: { username: candidate } });
		if (!exists) return candidate;
		suffix += 1;
		candidate = `${base}${suffix}`;
	}
	// extremely unlikely; fall back to random suffix
	return `${base}${crypto.randomBytes(3).toString('hex')}`;
}



export const submit = async (req, res) => {
	try {
		const { email } = req.body;

		const existingUser = await prisma.user.findUnique({ where: { email } });
		if (existingUser) {
			return res.status(409).json({ success: false, error: { code: 'CONFLICT', message: 'An account with this email already exists' } });
		}

		const existingApp = await prisma.registrationApplication.findUnique({ where: { email } });
		if (existingApp && existingApp.status === 'PENDING') {
			return res.status(409).json({ success: false, error: { code: 'CONFLICT', message: 'A pending application already exists for this email' } });
		}

		// if a REJECTED or APPROVED app exists on this email, allow a fresh submission by
		// replacing the rejected record. approved records cannot be resubmitted.
		if (existingApp && existingApp.status === 'APPROVED') {
			return res.status(409).json({ success: false, error: { code: 'CONFLICT', message: 'This email already has an approved application' } });
		}

		let application;
		if (existingApp && existingApp.status === 'REJECTED') {
			application = await prisma.registrationApplication.update({
				where: { id: existingApp.id },
				data: {
					firstName: req.body.firstName,
					lastName: req.body.lastName,
					icPassportNumber: req.body.icPassportNumber,
					address: req.body.address,
					reason: req.body.reason,
					cvS3Key: req.body.cvS3Key,
					status: 'PENDING',
					rejectionReason: null,
					reviewedBy: null,
					reviewedAt: null,
					submittedAt: new Date(),
				},
			});
		} else {
			application = await prisma.registrationApplication.create({ data: req.body });
		}

		notifyAllAdmins(req.app, {
			type: 'REGISTRATION',
			title: 'New registration application',
			body: `${application.firstName} ${application.lastName} submitted a registration application`,
			referenceId: application.id,
			referenceType: 'registration_application',
		});

		return res.status(201).json({ success: true, data: { id: application.id } });
	} catch (err) {
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};



export const listAll = async (req, res) => {
	try {
		const status = req.query.status;
		const page = Math.max(1, parseInt(req.query.page || '1', 10));
		const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || '20', 10)));

		const where = status ? { status } : {};

		const [total, rows] = await Promise.all([
			prisma.registrationApplication.count({ where }),
			prisma.registrationApplication.findMany({
				where,
				orderBy: { submittedAt: 'desc' },
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
		const app = await prisma.registrationApplication.findUnique({ where: { id: req.params.id } });
		if (!app) {
			return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Application not found' } });
		}
		return res.status(200).json({ success: true, data: app });
	} catch (err) {
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};



export const approve = async (req, res) => {
	try {
		const { stationId, startDate } = req.body;
		const applicationId = req.params.id;
		const reviewerId = req.user.id;

		const application = await prisma.registrationApplication.findUnique({ where: { id: applicationId } });
		if (!application) {
			return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Application not found' } });
		}
		if (application.status !== 'PENDING') {
			return res.status(409).json({ success: false, error: { code: 'CONFLICT', message: 'Application has already been reviewed' } });
		}

		const station = await prisma.station.findUnique({ where: { id: stationId } });
		if (!station) {
			return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Station not found' } });
		}

		const username = await generateUniqueUsername(application.firstName, application.lastName);
		const rawToken = crypto.randomBytes(32).toString('hex');
		const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
		const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

		const result = await prisma.$transaction(async (tx) => {
			const user = await tx.user.create({
				data: {
					applicationId,
					role: 'GUIDE',
					username,
					email: application.email,
					icPassportNumber: application.icPassportNumber,
					status: 'INACTIVE',
					stationId,
					startDate: new Date(startDate),
				},
			});

			await tx.passwordResetToken.create({
				data: { userId: user.id, tokenHash, expiresAt },
			});

			await tx.registrationApplication.update({
				where: { id: applicationId },
				data: { status: 'APPROVED', reviewedBy: reviewerId, reviewedAt: new Date() },
			});

			return user;
		});

		const activationUrl = `${process.env.WEB_URL}/set-password?token=${rawToken}`;
		sendActivationEmail(application.email, `${application.firstName} ${application.lastName}`, activationUrl);

		return res.status(200).json({ success: true, data: { userId: result.id, username } });
	} catch (err) {
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};



export const reject = async (req, res) => {
	try {
		const { rejectionReason } = req.body;
		const applicationId = req.params.id;
		const reviewerId = req.user.id;

		const application = await prisma.registrationApplication.findUnique({ where: { id: applicationId } });
		if (!application) {
			return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Application not found' } });
		}
		if (application.status !== 'PENDING') {
			return res.status(409).json({ success: false, error: { code: 'CONFLICT', message: 'Application has already been reviewed' } });
		}

		await prisma.registrationApplication.update({
			where: { id: applicationId },
			data: {
				status: 'REJECTED',
				rejectionReason,
				reviewedBy: reviewerId,
				reviewedAt: new Date(),
			},
		});

		sendRegistrationRejectedEmail(
			application.email,
			`${application.firstName} ${application.lastName}`,
			rejectionReason,
		);

		return res.status(200).json({ success: true, data: { id: applicationId } });
	} catch (err) {
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};
