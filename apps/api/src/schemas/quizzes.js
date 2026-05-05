import { z } from 'zod';


export const createQuizSchema = z.object({
	moduleId: z.string().uuid(),
	title: z.string().min(1).max(255),
	passScorePct: z.number().int().min(0).max(100),
	timeLimitMinutes: z.number().int().min(1).nullable().optional(),
	retakePriceMyr: z.number().min(0).nullable().optional(),
	showScoreToGuide: z.boolean().optional(),
});


export const updateQuizSchema = z.object({
	title: z.string().min(1).max(255).optional(),
	passScorePct: z.number().int().min(0).max(100).optional(),
	timeLimitMinutes: z.number().int().min(1).nullable().optional(),
	retakePriceMyr: z.number().min(0).nullable().optional(),
	showScoreToGuide: z.boolean().optional(),
}).refine((d) => Object.keys(d).length > 0, { message: 'At least one field must be provided' });


export const questionOptionSchema = z.object({
	text: z.string().min(1).max(2000),
	isCorrect: z.boolean(),
	order: z.number().int().min(0),
});


export const createQuestionSchema = z.object({
	type: z.enum(['MCQ', 'TRUE_FALSE', 'SHORT_ANSWER', 'LONG_ANSWER']),
	text: z.string().min(1).max(5000),
	maxScore: z.number().min(0),
	order: z.number().int().min(0),
	options: z.array(questionOptionSchema).optional(),
}).refine((q) => {
	if (q.type === 'MCQ' || q.type === 'TRUE_FALSE') {
		return Array.isArray(q.options) && q.options.length >= 2 && q.options.some((o) => o.isCorrect);
	}
	return true;
}, { message: 'MCQ and TRUE_FALSE questions require at least 2 options with one correct answer' });


export const updateQuestionSchema = z.object({
	text: z.string().min(1).max(5000).optional(),
	maxScore: z.number().min(0).optional(),
	order: z.number().int().min(0).optional(),
	options: z.array(questionOptionSchema).optional(),
}).refine((d) => Object.keys(d).length > 0, { message: 'At least one field must be provided' });
