import { z } from 'zod';

export const createStationSchema = z.object({
	name: z.string().min(1)
});

export const updateStationSchema = z.object({
	name: z.string().min(1)
});