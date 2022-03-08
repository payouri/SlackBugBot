import { Router } from 'express';
import { GetSpaces } from './GetSpaces';
import { GetSpacesTags } from './GetSpacesTags';

const clickUpRouter = Router({});

clickUpRouter.get('/:backendId/spaces', GetSpaces);
clickUpRouter.get('/:backendId/tags', GetSpacesTags);
clickUpRouter.get('/spaces', GetSpaces);
clickUpRouter.get('/tags', GetSpacesTags);

export { clickUpRouter };
