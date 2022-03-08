import { RequestHandler } from 'express';

import { wrapAsync } from '../../../utils/wrapAsync';
import { GetBackendsRoute } from './GetBackends.route';
import { validator } from './GetBackends.validator';

export const GetBackends: RequestHandler[] = [
    validator,
    wrapAsync(GetBackendsRoute),
];
