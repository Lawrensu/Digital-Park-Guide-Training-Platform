import { z } from 'zod';


export const createBadgeSchema = z.object({
	name: z.string().min(1).max(100),
	description: z.string().min(1).max(500),
	imageS3Key: z.string().min(1).max(500),
	threshold: z.number().int().min(1),
});


export const updateBadgeSchema = z.object({
	name: z.string().min(1).max(100).optional(),
	description: z.string().min(1).max(500).optional(),
	imageS3Key: z.string().min(1).max(500).optional(),
	threshold: z.number().int().min(1).optional(),
}).refine((d) => Object.keys(d).length > 0, { message: 'At least one field must be provided' });
