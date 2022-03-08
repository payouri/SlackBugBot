import { RequestHandler } from 'express';

import { wrapAsync } from '../../../utils/wrapAsync';
import { DeleteBackendRoute } from './DeleteBackend.route';
import { validator } from './DeleteBackend.validator';

export const DeleteBackend: RequestHandler[] = [
    validator,
    wrapAsync(DeleteBackendRoute),
];
