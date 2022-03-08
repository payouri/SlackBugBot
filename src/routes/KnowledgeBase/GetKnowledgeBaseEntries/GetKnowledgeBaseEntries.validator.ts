import { RequestHandler } from 'express';
import { getKnowledgeBaseEntriesQueryZod } from './GetKnowledgeBaseEntries.types';

export const validator: RequestHandler = (req, res, next) => {
    const validateQueryResult = getKnowledgeBaseEntriesQueryZod.safeParse(
        req.query
    );

    if (validateQueryResult.success === false) {
        return res.status(400).send(validateQueryResult);
    }

    req.query = validateQueryResult.data as unknown as Record<string, string>;

    return next();
};
