import prisma from '../lib/prisma.js';
import { getPresignedDownloadUrl } from '../lib/s3.js';


async function withPresignedImage(badge) {
	try {
		const url = await getPresignedDownloadUrl(badge.imageS3Key, 3600);
		return { ...badge, imageUrl: url };
	} catch {
		return { ...badge, imageUrl: null };
	}
}



export const list = async (req, res) => {
	try {
		const badges = await prisma.badge.findMany({ orderBy: { threshold: 'asc' } });
		const withUrls = await Promise.all(badges.map(withPresignedImage));
		return res.status(200).json({ success: true, data: withUrls });
	} catch (err) {
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};



export const create = async (req, res) => {
	try {
		const badge = await prisma.badge.create({ data: req.body });
		return res.status(201).json({ success: true, data: badge });
	} catch (err) {
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};



export const update = async (req, res) => {
	try {
		const existing = await prisma.badge.findUnique({ where: { id: req.params.id } });
		if (!existing) {
			return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Badge not found' } });
		}
		const badge = await prisma.badge.update({ where: { id: req.params.id }, data: req.body });
		return res.status(200).json({ success: true, data: badge });
	} catch (err) {
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};



export const remove = async (req, res) => {
	try {
		await prisma.$transaction(async (tx) => {
			await tx.userBadge.deleteMany({ where: { badgeId: req.params.id } });
			await tx.badge.delete({ where: { id: req.params.id } });
		});
		return res.status(204).send();
	} catch (err) {
		if (err.code === 'P2025') {
			return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Badge not found' } });
		}
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};



// guide's own earned badges (or any guide's, for admins)
export const listEarned = async (req, res) => {
	try {
		const targetUserId = req.params.userId;
		if (req.user.role === 'GUIDE' && req.user.id !== targetUserId) {
			return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Insufficient permissions' } });
		}

		const earned = await prisma.userBadge.findMany({
			where: { userId: targetUserId },
			orderBy: { awardedAt: 'desc' },
			include: { badge: true },
		});

		const withUrls = await Promise.all(earned.map(async (ub) => ({
			...ub,
			badge: await withPresignedImage(ub.badge),
		})));

		return res.status(200).json({ success: true, data: withUrls });
	} catch (err) {
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};
