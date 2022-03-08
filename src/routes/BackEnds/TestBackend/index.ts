import { RequestHandler } from 'express';

import { wrapAsync } from '../../../utils/wrapAsync';
import { TestBackendRoute } from './TestBackend.route';
import { validator } from './TestBackend.validator';

export const TestBackend: RequestHandler[] = [
    validator,
    wrapAsync(TestBackendRoute),
];
