import { z } from 'zod';

export const createInviteSchema = z.object({
  email: z.email().optional(),
  expiresInDays: z.number().int().min(1).max(30).optional(),
});

export const acceptInviteSchema = z.object({
  calendarSyncMode: z.enum(['ALL', 'ONLY_NEW', 'NONE']).default('NONE'),
});
