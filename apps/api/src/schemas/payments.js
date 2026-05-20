import { z } from 'zod';

export const initiatePaymentSchema = z.object({
	quizId: z.string().uuid()
});

export const getMyPaymentQuerySchema = z.object({
	quizId: z.string().uuid()
});
