import { RequestHandler } from 'express';
import { wrapAsync } from '../../../../utils/wrapAsync';
import { GetSpacesRoute } from './GetSpaces.route';
import { validator } from './GetSpaces.validator';

export const GetSpaces: RequestHandler[] = [
    validator,
    wrapAsync(GetSpacesRoute),
];
