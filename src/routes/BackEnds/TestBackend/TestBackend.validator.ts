import { RequestHandler } from 'express';

import { testBackendParamsZod } from './TestBackend.types';

export const validator: RequestHandler = (req, res, next) => {
    const validateParamsResult = testBackendParamsZod.safeParse(req.params);

    if (validateParamsResult.success === false) {
        return res.status(400).send(validateParamsResult);
    }

    req.params = validateParamsResult.data;

    return next();
};
