import { z } from 'zod';


export const createEnrolmentSchema = z.object({
	guideId: z.string().uuid(),
	moduleId: z.string().uuid(),
	dueAt: z.string().datetime().nullable().optional(),
});


export const selfEnrolmentSchema = z.object({
	moduleId: z.string().uuid(),
});


export const updateEnrolmentSchema = z.object({
	dueAt: z.string().datetime().nullable(),
});


export const markProgressSchema = z.object({
	contentItemId: z.string().uuid(),
});
