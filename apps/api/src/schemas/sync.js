import { z } from 'zod';


// offline batch submission from mobile: attempts collected while offline
// server applies last write wins using client side timestamps
export const syncBatchSchema = z.object({
	attempts: z.array(z.object({
		clientId: z.string().min(1),
		quizId: z.string().uuid(),
		attemptNumber: z.number().int().min(1),
		submittedAt: z.string().datetime(),
		responses: z.array(z.object({
			questionId: z.string().uuid(),
			selectedOptionId: z.string().uuid().nullable().optional(),
			textResponse: z.string().nullable().optional(),
		})),
	})).optional(),
});
