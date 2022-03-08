import { RequestHandler } from 'express';

import {
    getSpacesTagsParamsZod,
    getSpacesTagsQueryZod,
} from './GetSpacesTags.types';

export const validator: RequestHandler = (req, res, next) => {
    const validateParamsResult = getSpacesTagsParamsZod.safeParse(req.params);
    const validateQueryResult = getSpacesTagsQueryZod.safeParse(req.query);

    if (
        validateParamsResult.success === false ||
        validateQueryResult.success === false
    ) {
        if (validateParamsResult.success === false)
            return res.status(400).send(validateParamsResult);
        if (validateQueryResult.success === false) {
            return res.status(400).send(validateQueryResult);
        }
    }

    if (validateParamsResult.success) {
        req.params = validateParamsResult.data;
    }
    if (validateQueryResult.success) {
        req.query = validateQueryResult.data;
    }

    return next();
};
