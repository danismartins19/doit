import { z } from 'zod';
import { hexColorSchema } from '../common/zod';

export const createProjectSchema = z.object({
  name: z.string().min(1).max(120),
  color: hexColorSchema,
});

export const updateProjectSchema = createProjectSchema.partial();

export const updateMemberSchema = z.object({
  calendarSyncMode: z.enum(['ALL', 'ONLY_NEW', 'NONE']).optional(),
});
