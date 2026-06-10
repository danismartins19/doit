import { z } from 'zod';
import { isoDateSchema } from '../common/zod';

export const createTaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(4000).optional(),
  details: z.string().max(12000).optional(),
  day: isoDateSchema,
  deadline: isoDateSchema.optional().nullable(),
  responsibleId: z.string().min(1).optional().nullable(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'DONE', 'CANCELED']).optional(),
  order: z.number().int().optional(),
});

export const updateTaskSchema = createTaskSchema.partial();

export const moveTaskSchema = z.object({
  day: isoDateSchema,
  order: z.number().int().optional(),
});

export const statusSchema = z.object({
  status: z.enum(['PENDING', 'IN_PROGRESS', 'DONE', 'CANCELED']),
});

export const responsibleSchema = z.object({
  responsibleId: z.string().min(1).nullable(),
});
