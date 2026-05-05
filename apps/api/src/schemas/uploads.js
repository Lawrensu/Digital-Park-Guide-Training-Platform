import { z } from 'zod';


export const presignUploadSchema = z.object({
	purpose: z.enum(['cv', 'content-image', 'badge-image', 'iot-evidence']),
	contentType: z.string().min(1).max(100),
	extension: z.string().min(1).max(10),
});
