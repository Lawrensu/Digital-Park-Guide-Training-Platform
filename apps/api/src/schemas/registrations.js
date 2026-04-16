import { z } from 'zod';


export const submitRegistrationSchema = z.object({
	firstName: z.string().min(1).max(100),
	lastName: z.string().min(1).max(100),
	email: z.string().email().max(255),
	icPassportNumber: z.string().min(1).max(50),
	address: z.string().min(1).max(500),
	reason: z.string().min(1).max(2000),
	cvS3Key: z.string().min(1).max(500),
});


export const approveRegistrationSchema = z.object({
	stationId: z.string().uuid(),
	startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});


export const rejectRegistrationSchema = z.object({
	rejectionReason: z.string().min(1).max(1000),
});
