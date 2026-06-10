import { BadRequestException } from '@nestjs/common';
import { z } from 'zod';

export function parseBody<T extends z.ZodType>(schema: T, value: unknown): z.infer<T> {
  const result = schema.safeParse(value);

  if (!result.success) {
    throw new BadRequestException({
      message: 'Validation failed',
      issues: result.error.issues,
    });
  }

  return result.data;
}

export const cuidSchema = z.string().min(1);
export const hexColorSchema = z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
export const isoDateSchema = z.coerce.date();
