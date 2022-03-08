import { Router } from 'express';
import { clickUpRouter } from './ClickUp';

import { CreateBackend } from './CreateBackend';
import { DeleteBackend } from './DeleteBackend';
import { GetBackends } from './GetBackends';
import { TestBackend } from './TestBackend';
import { UpdateBackend } from './UpdateBackend';

const backEndsRouter = Router({});

backEndsRouter.use('/clickUp', clickUpRouter);

backEndsRouter.post('/', CreateBackend);
backEndsRouter.get('/', GetBackends);
backEndsRouter.get('/:backendId/test', TestBackend);
backEndsRouter.delete('/:backendId', DeleteBackend);
backEndsRouter.put('/:backendId/:type', UpdateBackend);
backEndsRouter.patch('/:backendId/:type', UpdateBackend);

export { backEndsRouter };
