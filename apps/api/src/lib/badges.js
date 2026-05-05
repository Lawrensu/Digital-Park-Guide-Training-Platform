import prisma from './prisma.js';


// called after a certification is issued; awards any badges whose thresholds are newly met
// side effect only; never throws up to the caller
export async function checkAndAwardBadges(guideId) {
	try {
		const user = await prisma.user.findUnique({ where: { id: guideId } });
		if (!user || user.role !== 'GUIDE') return [];

		const certCount = await prisma.certification.count({ where: { guideId } });

		const eligibleBadges = await prisma.badge.findMany({
			where: { threshold: { lte: certCount } },
		});

		const newlyAwarded = [];
		for (const badge of eligibleBadges) {
			try {
				const created = await prisma.userBadge.create({
					data: { userId: guideId, badgeId: badge.id },
				});
				newlyAwarded.push({ badge, userBadge: created });
			} catch (err) {
				// P2002 = already has this badge; skip silently
				if (err.code !== 'P2002') throw err;
			}
		}

		return newlyAwarded;
	} catch (err) {
		console.error('checkAndAwardBadges failed:', err.message);
		return [];
	}
}
