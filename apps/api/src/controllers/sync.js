import prisma from '../lib/prisma.js';
import { notifyUsers, notifyAllAdmins } from '../lib/notifications.js';


// offline batch sync: skips the payment gate because the client was offline
// server accepts the client reported attemptNumber but normalises it to max+1 on collision
export const batch = async (req, res) => {
	try {
		const guideId = req.user.id;
		const { attempts = [] } = req.body;

		const results = [];

		for (const a of attempts) {
			try {
				const quiz = await prisma.quiz.findUnique({
					where: { id: a.quizId },
					include: { questions: { include: { options: true } } },
				});
				if (!quiz) {
					results.push({ clientId: a.clientId, status: 'rejected', reason: 'Quiz not found' });
					continue;
				}

				const prior = await prisma.quizAttempt.findMany({
					where: { quizId: a.quizId, guideId },
					orderBy: { attemptNumber: 'desc' },
					take: 1,
				});
				const nextAttemptNumber = prior.length ? prior[0].attemptNumber + 1 : 1;

				const questionMap = new Map(quiz.questions.map((q) => [q.id, q]));
				let totalAuto = 0;
				let hasManual = false;
				const questionAttempts = [];

				for (const r of a.responses) {
					const q = questionMap.get(r.questionId);
					if (!q) continue;

					let scoreAwarded = null;
					let isAutoScored = false;
					if (q.type === 'MCQ' || q.type === 'TRUE_FALSE') {
						const chosen = q.options.find((o) => o.id === r.selectedOptionId);
						scoreAwarded = chosen?.isCorrect ? Number(q.maxScore) : 0;
						isAutoScored = true;
						totalAuto += Number(scoreAwarded);
					} else {
						hasManual = true;
					}

					questionAttempts.push({
						questionId: r.questionId,
						selectedOptionId: r.selectedOptionId || null,
						textResponse: r.textResponse || null,
						scoreAwarded,
						isAutoScored,
					});
				}

				const attempt = await prisma.quizAttempt.create({
					data: {
						quizId: a.quizId,
						guideId,
						attemptNumber: nextAttemptNumber,
						status: hasManual ? 'PENDING_REVIEW' : 'GRADED',
						totalScore: hasManual ? null : totalAuto,
						submittedAt: new Date(a.submittedAt),
						gradedAt: hasManual ? null : new Date(),
						questionAttempts: { create: questionAttempts },
					},
				});

				if (!hasManual) {
					notifyUsers(req.app, [guideId], {
						type: 'QUIZ_RESULT',
						title: 'Offline quiz synced',
						body: `Your offline attempt for "${quiz.title}" has been processed`,
						referenceId: attempt.id,
						referenceType: 'quiz_attempt',
					});
				} else {
					notifyAllAdmins(req.app, {
						type: 'QUIZ_RESULT',
						title: 'Offline attempt awaiting review',
						body: `An offline attempt for "${quiz.title}" needs manual grading`,
						referenceId: attempt.id,
						referenceType: 'quiz_attempt',
					});
				}

				results.push({ clientId: a.clientId, status: 'accepted', serverAttemptId: attempt.id });
			} catch (err) {
				results.push({ clientId: a.clientId, status: 'rejected', reason: err.message });
			}
		}

		return res.status(200).json({ success: true, data: { results } });
	} catch (err) {
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};
