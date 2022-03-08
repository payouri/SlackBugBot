import { RequestHandler } from 'express';

import { createBackendBodyZod } from './CreateBackend.types';

export const validator: RequestHandler = (req, res, next) => {
    const validateResult = createBackendBodyZod.safeParse(req.body);

    if (validateResult.success === false) {
        return res.status(400).send(validateResult);
    }

    req.body = validateResult.data;

    return next();
};
