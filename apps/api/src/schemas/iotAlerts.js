import { z } from 'zod';


export const ingestAlertSchema = z.object({
	deviceIdentifier: z.string().min(1).max(100),
	detectionType: z.enum(['PLANT_DAMAGE', 'WILDLIFE_DISTURBANCE']),
	confidence: z.number().min(0).max(1),
	evidenceS3Key: z.string().min(1).max(500),
	detectedAt: z.string().datetime(),
});


export const flagAlertSchema = z.object({
	status: z.enum(['CONFIRMED', 'FALSE_DETECTION']),
});
