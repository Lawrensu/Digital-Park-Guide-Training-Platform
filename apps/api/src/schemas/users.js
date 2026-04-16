import { z } from 'zod';


export const updateUserSchema = z.object({
	stationId: z.string().uuid().nullable().optional(),
	startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
	email: z.string().email().max(255).optional(),
}).refine((d) => Object.keys(d).length > 0, { message: 'At least one field must be provided' });


export const updateUserStatusSchema = z.object({
	status: z.enum(['ACTIVE', 'SUSPENDED', 'INACTIVE']),
});


export const createAdminSchema = z.object({
	firstName: z.string().min(1).max(100),
	lastName: z.string().min(1).max(100),
	email: z.string().email().max(255),
});
