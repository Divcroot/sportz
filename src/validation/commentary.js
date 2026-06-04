import { z } from 'zod';

// Schema for list commentary query parameters
const listCommentaryQuerySchema = z.object({
  limit: z.coerce
    .number()
    .int()
    .positive()
    .max(100)
    .optional(),
});

// Schema for creating commentary
const createCommentarySchema = z.object({
  minute: z.coerce
    .number()
    .int()
    .nonnegative(),
  sequence: z.coerce
    .number()
    .int()
    .optional(),
  period: z.string().min(1, 'Period is required'),
  eventType: z.string().min(1, 'Event type is required'),
  actor: z.string().min(1).optional(),
  team: z.string().min(1).optional(),
  message: z.string().min(1, 'Message is required'),
  metadata: z.record(z.string(), z.any()).optional(),
  tags: z.array(z.string()).optional(),
});

export {
  listCommentaryQuerySchema,
  createCommentarySchema,
};
