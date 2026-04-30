import { z } from 'zod';


export const createModuleSchema = z.object({
	title: z.string().min(1).max(255),
	description: z.string().min(1).max(5000),
});


export const updateModuleSchema = z.object({
	title: z.string().min(1).max(255).optional(),
	description: z.string().min(1).max(5000).optional(),
}).refine((d) => Object.keys(d).length > 0, { message: 'At least one field must be provided' });


export const moduleStatusSchema = z.object({
	status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
});
