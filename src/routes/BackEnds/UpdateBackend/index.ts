import { RequestHandler } from 'express';

import { wrapAsync } from '../../../utils/wrapAsync';
import { UpdateBackendRoute } from './UpdateBackend.route';
import { validator } from './UpdateBackend.validator';

export const UpdateBackend: RequestHandler[] = [
    validator,
    wrapAsync(UpdateBackendRoute),
];
