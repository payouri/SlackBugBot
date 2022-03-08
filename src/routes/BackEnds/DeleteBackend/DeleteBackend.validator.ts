import { RequestHandler } from 'express';

import { deleteBackendParamsZod } from './DeleteBackend.types';

export const validator: RequestHandler = (req, res, next) => {
    const validateParamsResult = deleteBackendParamsZod.safeParse(req.params);

    if (validateParamsResult.success === false) {
        return res.status(400).send(validateParamsResult);
    }

    req.params = validateParamsResult.data;

    return next();
};
