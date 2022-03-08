import { RequestHandler } from 'express';

import {
    updateBackendBodyZod,
    updateBackendParamsZod,
} from './UpdateBackend.types';

export const validator: RequestHandler = (req, res, next) => {
    const validateParamsResult = updateBackendParamsZod.safeParse(req.params);

    if (validateParamsResult.success === false) {
        return res.status(400).send(validateParamsResult);
    }

    const validateBodyResult = updateBackendBodyZod.safeParse(req.body);

    if (validateBodyResult.success === false) {
        return res.status(400).send(validateBodyResult);
    }

    req.params = validateParamsResult.data;
    req.body = validateBodyResult.data;

    return next();
};
