import { RequestHandler } from 'express';

import { getBackendsQueryZod } from './GetBackends.types';

export const validator: RequestHandler = (req, res, next) => {
    const validateQueryResult = getBackendsQueryZod.safeParse(req.query);

    if (validateQueryResult.success === false) {
        return res.status(400).send(validateQueryResult);
    }

    req.query = validateQueryResult.data as Record<string, string>;

    return next();
};
