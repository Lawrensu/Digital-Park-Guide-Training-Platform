import prisma from '../lib/prisma.js';


// strip correct answer data when serving questions to a guide
function sanitizeQuestionsForGuide(questions) {
	return questions.map((q) => ({
		...q,
		options: q.options ? q.options.map(({ isCorrect, ...rest }) => rest) : undefined,
	}));
}



export const list = async (req, res) => {
	try {
		const { moduleId } = req.query;
		const where = moduleId ? { moduleId } : {};
		const quizzes = await prisma.quiz.findMany({
			where,
			orderBy: { createdAt: 'desc' },
			include: {
				module: { select: { id: true, title: true } },
				_count: { select: { questions: true, quizAttempts: true } },
			},
		});
		return res.status(200).json({ success: true, data: quizzes });
	} catch (err) {
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};



export const getOne = async (req, res) => {
	try {
		const quiz = await prisma.quiz.findUnique({
			where: { id: req.params.id },
			include: {
				questions: {
					orderBy: { order: 'asc' },
					include: { options: { orderBy: { order: 'asc' } } },
				},
			},
		});
		if (!quiz) {
			return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Quiz not found' } });
		}

		if (req.user.role === 'GUIDE') {
			quiz.questions = sanitizeQuestionsForGuide(quiz.questions);
		}

		return res.status(200).json({ success: true, data: quiz });
	} catch (err) {
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};



export const create = async (req, res) => {
	try {
		const module = await prisma.module.findUnique({ where: { id: req.body.moduleId } });
		if (!module) {
			return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Module not found' } });
		}

		const quiz = await prisma.quiz.create({ data: req.body });
		return res.status(201).json({ success: true, data: quiz });
	} catch (err) {
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};



export const update = async (req, res) => {
	try {
		const existing = await prisma.quiz.findUnique({ where: { id: req.params.id } });
		if (!existing) {
			return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Quiz not found' } });
		}
		const quiz = await prisma.quiz.update({ where: { id: req.params.id }, data: req.body });
		return res.status(200).json({ success: true, data: quiz });
	} catch (err) {
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};



export const remove = async (req, res) => {
	try {
		const attemptCount = await prisma.quizAttempt.count({ where: { quizId: req.params.id } });
		if (attemptCount > 0) {
			return res.status(409).json({ success: false, error: { code: 'CONFLICT', message: 'Cannot delete a quiz that has attempts' } });
		}
		await prisma.quiz.delete({ where: { id: req.params.id } });
		return res.status(204).send();
	} catch (err) {
		if (err.code === 'P2025') {
			return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Quiz not found' } });
		}
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};



export const addQuestion = async (req, res) => {
	try {
		const { quizId } = req.params;
		const quiz = await prisma.quiz.findUnique({ where: { id: quizId } });
		if (!quiz) {
			return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Quiz not found' } });
		}

		const { options, ...questionData } = req.body;
		const question = await prisma.question.create({
			data: {
				...questionData,
				quizId,
				options: options ? { create: options } : undefined,
			},
			include: { options: true },
		});
		return res.status(201).json({ success: true, data: question });
	} catch (err) {
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};



export const updateQuestion = async (req, res) => {
	try {
		const { questionId } = req.params;
		const existing = await prisma.question.findUnique({ where: { id: questionId } });
		if (!existing) {
			return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Question not found' } });
		}

		const { options, ...questionData } = req.body;

		const result = await prisma.$transaction(async (tx) => {
			if (options) {
				// replace all strategy for options
				const oldOptionIds = (await tx.questionOption.findMany({ where: { questionId }, select: { id: true } })).map((o) => o.id);
				await tx.questionAttempt.deleteMany({ where: { selectedOptionId: { in: oldOptionIds } } });
				await tx.questionOption.deleteMany({ where: { questionId } });
				await tx.questionOption.createMany({
					data: options.map((o) => ({ ...o, questionId })),
				});
			}
			return tx.question.update({
				where: { id: questionId },
				data: Object.keys(questionData).length > 0 ? questionData : {},
				include: { options: { orderBy: { order: 'asc' } } },
			});
		});

		return res.status(200).json({ success: true, data: result });
	} catch (err) {
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};



export const removeQuestion = async (req, res) => {
	try {
		const { questionId } = req.params;
		await prisma.$transaction(async (tx) => {
			await tx.questionAttempt.deleteMany({ where: { questionId } });
			await tx.questionOption.deleteMany({ where: { questionId } });
			await tx.question.delete({ where: { id: questionId } });
		});
		return res.status(204).send();
	} catch (err) {
		if (err.code === 'P2025') {
			return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Question not found' } });
		}
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};
