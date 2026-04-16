import { z } from 'zod';


export const customNotificationSchema = z.object({
	userIds: z.array(z.string().uuid()).min(1).optional(),
	role: z.enum(['ADMIN', 'GUIDE']).optional(),
	title: z.string().min(1).max(255),
	body: z.string().min(1).max(2000),
}).refine((d) => d.userIds || d.role, { message: 'Either userIds or role must be provided' });
