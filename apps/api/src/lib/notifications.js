import prisma from './prisma.js';


// fan out helper: creates N notifications in one call and emits socket events
// side effect only; never throws up to the caller
export async function notifyUsers(app, userIds, { type, title, body, referenceId = null, referenceType = null }) {
	if (!userIds || userIds.length === 0) return;

	try {
		const rows = userIds.map((userId) => ({
			userId,
			type,
			title,
			body,
			referenceId,
			referenceType,
		}));

		await prisma.notification.createMany({ data: rows });

		const io = app?.get?.('io');
		if (io) {
			for (const userId of userIds) {
				io.to(`user:${userId}`).emit('notification', { type, title, body, referenceId, referenceType });
			}
		}
	} catch (err) {
		console.error('notifyUsers failed:', err.message);
	}
}


export async function notifyAllAdmins(app, payload) {
	try {
		const admins = await prisma.user.findMany({
			where: { role: 'ADMIN', status: 'ACTIVE' },
			select: { id: true },
		});
		await notifyUsers(app, admins.map((a) => a.id), payload);
	} catch (err) {
		console.error('notifyAllAdmins failed:', err.message);
	}
}
