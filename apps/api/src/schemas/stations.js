import { z } from 'zod';

export const createStationSchema = z.object({
    name: z.string().trim().min(1, "Station name is required")
});

export const updateStationSchema = z.object({
    // If don't add .optional(), Zod will block the request if the admin only wants to update the name but forgets something else
    name: z.string().trim().min(1, "Station name cannot be empty").optional()
});
