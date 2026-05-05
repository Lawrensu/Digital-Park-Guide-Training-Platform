import { z } from 'zod';


export const issueCertificationSchema = z.object({
	guideId: z.string().uuid(),
	quizAttemptId: z.string().uuid(),
	moduleId: z.string().uuid(),
	companyName: z.string().min(1).max(255),
	issuerName: z.string().min(1).max(255),
	issuerTitle: z.string().min(1).max(255),
	issueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
	expiryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
});
