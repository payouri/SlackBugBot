import { RequestHandler } from 'express';

import { wrapAsync } from '../../../../utils/wrapAsync';
import { GetSpacesTagsRoute } from './GetSpacesTags.route';
import { validator } from './GetSpacesTags.validator';

export const GetSpacesTags: RequestHandler[] = [
    validator,
    wrapAsync(GetSpacesTagsRoute),
];
