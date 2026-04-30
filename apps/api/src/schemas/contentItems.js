import { z } from 'zod';


// content type specific fields validated via discriminated union on the type field
const base = {
	title: z.string().max(255).optional().nullable(),
	order: z.number().int().min(0).optional(),
};

const videoFields = z.object({
	type: z.literal('VIDEO'),
	videoSource: z.enum(['S3', 'YOUTUBE']),
	videoUrl: z.string().min(1).max(1000),
	allowOffline: z.boolean().optional(),
	...base,
});

const imageFields = z.object({
	type: z.literal('IMAGE'),
	imageS3Key: z.string().min(1).max(500),
	...base,
});

const textFields = z.object({
	type: z.literal('TEXT'),
	textContent: z.string().min(1),
	...base,
});

const infographicFields = z.object({
	type: z.literal('INFOGRAPHIC'),
	infographicSubtype: z.enum(['HOTSPOT', 'SCENARIO', 'STEPPER']),
	infographicContent: z.any(),
	...base,
});

const quizFields = z.object({
	type: z.literal('QUIZ'),
	quizId: z.string().uuid(),
	...base,
});


export const createContentItemSchema = z.discriminatedUnion('type', [
	videoFields, imageFields, textFields, infographicFields, quizFields,
]);


export const updateContentItemSchema = z.object({
	title: z.string().max(255).optional().nullable(),
	order: z.number().int().min(0).optional(),
	videoSource: z.enum(['S3', 'YOUTUBE']).optional(),
	videoUrl: z.string().min(1).max(1000).optional(),
	allowOffline: z.boolean().optional(),
	imageS3Key: z.string().min(1).max(500).optional(),
	textContent: z.string().min(1).optional(),
	infographicSubtype: z.enum(['HOTSPOT', 'SCENARIO', 'STEPPER']).optional(),
	infographicContent: z.any().optional(),
	quizId: z.string().uuid().optional(),
}).refine((d) => Object.keys(d).length > 0, { message: 'At least one field must be provided' });


export const reorderContentItemsSchema = z.object({
	items: z.array(z.object({
		id: z.string().uuid(),
		order: z.number().int().min(0),
	})).min(1),
});
