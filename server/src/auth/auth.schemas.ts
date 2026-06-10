import { z } from 'zod';

export const updateCalendarPreferenceSchema = z.object({
  calendarSyncEnabled: z.boolean(),
});
