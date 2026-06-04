import { Router } from 'express';
import { matchIdParamSchema } from '../validation/matches.js';
import { listCommentaryQuerySchema, createCommentarySchema } from '../validation/commentary.js';
import { db } from '../db/db.js';
import { commentary } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';

const commentaryRouter = Router({ mergeParams: true });

commentaryRouter.get('/', async (req, res) => {
    const paramsResult = matchIdParamSchema.safeParse(req.params);

    if (!paramsResult.success) {
        return res.status(400).json({ error: 'Invalid match ID.', issues: paramsResult.error.issues });
    }

    const queryResult = listCommentaryQuerySchema.safeParse(req.query);

    if (!queryResult.success) {
        return res.status(400).json({ error: 'Invalid query.', issues: queryResult.error.issues });
    }

    const { id: matchId } = paramsResult.data;
    const MAX_LIMIT = 100;
    const limit = Math.min(queryResult.data.limit ?? 100, MAX_LIMIT);

    try {
        const data = await db
            .select()
            .from(commentary)
            .where(eq(commentary.matchId, matchId))
            .orderBy(desc(commentary.createdAt))
            .limit(limit);

        res.json({ data });
    } catch (error) {
        console.error('Failed to fetch commentary:', error);
        res.status(500).json({ error: 'Failed to fetch commentary.' });
    }
});

commentaryRouter.post('/', async (req, res) => {
    const paramsResult = matchIdParamSchema.safeParse(req.params);

    if (!paramsResult.success) {
        return res.status(400).json({ error: 'Invalid match ID.', issues: paramsResult.error.issues });
    }

    const bodyParsed = createCommentarySchema.safeParse(req.body);

    if (!bodyParsed.success) {
        return res.status(400).json({ error: 'Invalid payload.', issues: bodyParsed.error.issues });
    }

    const { minute, sequence, period, eventType, actor, team, message, metadata, tags } = bodyParsed.data;

    try {
        const [event] = await db
            .insert(commentary)
            .values({
                matchId: paramsResult.data.id,
                minute,
                sequence: sequence ?? 0,
                period,
                eventType,
                actor: actor ?? null,
                team: team ?? null,
                message,
                metadata: metadata || null,
                tags: tags ? JSON.stringify(tags) : null,
            })
            .returning();

            if(req.app.locals.broadcastCommentary){
                req.app.locals.broadcastCommentary(event.matchId, event);
            }

        res.status(201).json({ data: event });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to create commentary.' });
    }
});

export { commentaryRouter };