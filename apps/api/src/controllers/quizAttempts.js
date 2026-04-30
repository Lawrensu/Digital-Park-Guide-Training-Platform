import prisma from '../lib/prisma.js';
import { notifyUsers, notifyAllAdmins } from '../lib/notifications.js';


export const submit = async (req, res) => {
	try {
		const { quizId, responses } = req.body;
		const guideId = req.user.id;

		const quiz = await prisma.quiz.findUnique({
			where: { id: quizId },
			include: {
				questions: { include: { options: true } },
			},
		});
		if (!quiz) {
			return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Quiz not found' } });
		}

		const prior = await prisma.quizAttempt.findMany({
			where: { quizId, guideId },
			orderBy: { attemptNumber: 'desc' },
			take: 1,
		});
		const nextAttemptNumber = prior.length ? prior[0].attemptNumber + 1 : 1;

		// retake gate: after first attempt, a PAID Payment row (unused by an attempt) is required
		let consumedPayment = null;
		if (nextAttemptNumber > 1 && quiz.retakePriceMyr && Number(quiz.retakePriceMyr) > 0) {
			consumedPayment = await prisma.payment.findFirst({
				where: { quizId, userId: guideId, status: 'PAID', quizAttemptId: null },
				orderBy: { createdAt: 'asc' },
			});
			if (!consumedPayment) {
				return res.status(402).json({ success: false, error: { code: 'PAYMENT_REQUIRED', message: 'Retake requires a completed payment' } });
			}
		}

		// auto scoring for MCQ and TRUE_FALSE questions
		const questionMap = new Map(quiz.questions.map((q) => [q.id, q]));
		let totalAuto = 0;
		let hasManual = false;
		const questionAttempts = [];

		for (const r of responses) {
			const q = questionMap.get(r.questionId);
			if (!q) continue;

			let scoreAwarded = null;
			let isAutoScored = false;

			if (q.type === 'MCQ' || q.type === 'TRUE_FALSE') {
				const chosen = q.options.find((o) => o.id === r.selectedOptionId);
				const correct = !!chosen && chosen.isCorrect;
				scoreAwarded = correct ? Number(q.maxScore) : 0;
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

		const attempt = await prisma.$transaction(async (tx) => {
			const created = await tx.quizAttempt.create({
				data: {
					quizId,
					guideId,
					attemptNumber: nextAttemptNumber,
					status: hasManual ? 'PENDING_REVIEW' : 'GRADED',
					totalScore: hasManual ? null : totalAuto,
					submittedAt: new Date(),
					gradedAt: hasManual ? null : new Date(),
					questionAttempts: { create: questionAttempts },
				},
				include: { questionAttempts: true },
			});

			if (consumedPayment) {
				await tx.payment.update({
					where: { id: consumedPayment.id },
					data: { quizAttemptId: created.id },
				});
			}

			return created;
		});

		// if fully auto graded, notify the guide; if manual review needed, notify admins
		if (!hasManual) {
			notifyUsers(req.app, [guideId], {
				type: 'QUIZ_RESULT',
				title: 'Quiz result ready',
				body: `Your quiz "${quiz.title}" has been auto-graded`,
				referenceId: attempt.id,
				referenceType: 'quiz_attempt',
			});
		} else {
			notifyAllAdmins(req.app, {
				type: 'QUIZ_RESULT',
				title: 'Quiz attempt awaiting review',
				body: `A quiz attempt for "${quiz.title}" needs manual grading`,
				referenceId: attempt.id,
				referenceType: 'quiz_attempt',
			});
		}

		return res.status(201).json({ success: true, data: attempt });
	} catch (err) {
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};



export const list = async (req, res) => {
	try {
		const { quizId, guideId, status } = req.query;
		const page = Math.max(1, parseInt(req.query.page || '1', 10));
		const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || '20', 10)));

		const where = {};
		if (req.user.role === 'GUIDE') {
			where.guideId = req.user.id;
		} else {
			if (guideId) where.guideId = guideId;
		}
		if (quizId) where.quizId = quizId;
		if (status) where.status = status;

		const [total, rows] = await Promise.all([
			prisma.quizAttempt.count({ where }),
			prisma.quizAttempt.findMany({
				where,
				orderBy: { submittedAt: 'desc' },
				skip: (page - 1) * limit,
				take: limit,
				include: {
					quiz: { select: { id: true, title: true, passScorePct: true } },
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
		const attempt = await prisma.quizAttempt.findUnique({
			where: { id: req.params.id },
			include: {
				quiz: true,
				guide: { select: { id: true, username: true, email: true } },
				questionAttempts: {
					include: {
						question: { include: { options: true } },
						selectedOption: true,
					},
				},
			},
		});
		if (!attempt) {
			return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Attempt not found' } });
		}

		if (req.user.role === 'GUIDE' && attempt.guideId !== req.user.id) {
			return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Insufficient permissions' } });
		}

		return res.status(200).json({ success: true, data: attempt });
	} catch (err) {
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};



export const grade = async (req, res) => {
	try {
		const attempt = await prisma.quizAttempt.findUnique({
			where: { id: req.params.id },
			include: { questionAttempts: true },
		});
		if (!attempt) {
			return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Attempt not found' } });
		}
		if (attempt.status === 'GRADED') {
			return res.status(409).json({ success: false, error: { code: 'CONFLICT', message: 'Attempt already graded' } });
		}

		const { grades } = req.body;
		const map = new Map(attempt.questionAttempts.map((qa) => [qa.id, qa]));
		for (const g of grades) {
			if (!map.has(g.questionAttemptId)) {
				return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Grade references a question attempt that does not belong to this attempt' } });
			}
		}

		const result = await prisma.$transaction(async (tx) => {
			for (const g of grades) {
				await tx.questionAttempt.update({
					where: { id: g.questionAttemptId },
					data: { scoreAwarded: g.scoreAwarded },
				});
			}

			const all = await tx.questionAttempt.findMany({ where: { quizAttemptId: attempt.id } });
			const total = all.reduce((sum, qa) => sum + Number(qa.scoreAwarded || 0), 0);

			return tx.quizAttempt.update({
				where: { id: attempt.id },
				data: {
					status: 'GRADED',
					totalScore: total,
					gradedAt: new Date(),
					gradedBy: req.user.id,
				},
			});
		});

		notifyUsers(req.app, [attempt.guideId], {
			type: 'QUIZ_RESULT',
			title: 'Quiz result ready',
			body: 'Your quiz attempt has been graded',
			referenceId: attempt.id,
			referenceType: 'quiz_attempt',
		});

		return res.status(200).json({ success: true, data: result });
	} catch (err) {
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};
