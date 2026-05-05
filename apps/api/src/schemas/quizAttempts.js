import { z } from 'zod';


export const submitAttemptSchema = z.object({
	quizId: z.string().uuid(),
	responses: z.array(z.object({
		questionId: z.string().uuid(),
		selectedOptionId: z.string().uuid().nullable().optional(),
		textResponse: z.string().nullable().optional(),
	})).min(1),
});


export const gradeAttemptSchema = z.object({
	grades: z.array(z.object({
		questionAttemptId: z.string().uuid(),
		scoreAwarded: z.number().min(0),
	})).min(1),
});
