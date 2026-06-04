import { z } from 'zod';

// Match status constants
const MATCH_STATUS = {
  SCHEDULED: 'scheduled',
  LIVE: 'live',
  FINISHED: 'finished',
};

// Schema for list matches query parameters
const listMatchesQuerySchema = z.object({
  limit: z.coerce
    .number()
    .int()
    .positive()
    .max(100)
    .optional(),
});

// Schema for match ID parameter
const matchIdParamSchema = z.object({
  id: z.coerce
    .number()
    .int()
    .positive(),
});

// Schema for creating a match
const createMatchSchema = z
  .object({
    sport: z.string().min(1, 'Sport is required'),
    homeTeam: z.string().min(1, 'Home team is required'),
    awayTeam: z.string().min(1, 'Away team is required'),
    startTime: z.string().datetime(),
    endTime: z.string().datetime(),
    homeScore: z.coerce
      .number()
      .int()
      .nonnegative()
      .optional(),
    awayScore: z.coerce
      .number()
      .int()
      .nonnegative()
      .optional(),
  })
  .superRefine((data, ctx) => {
    const startTime = new Date(data.startTime);
    const endTime = new Date(data.endTime);

    if (endTime <= startTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'endTime must be chronologically after startTime',
        path: ['endTime'],
      });
    }
  });

// Schema for updating match score
const updateScoreSchema = z.object({
  homeScore: z.coerce
    .number()
    .int()
    .nonnegative(),
  awayScore: z.coerce
    .number()
    .int()
    .nonnegative(),
});

export {
  MATCH_STATUS,
  listMatchesQuerySchema,
  matchIdParamSchema,
  createMatchSchema,
  updateScoreSchema,
};
