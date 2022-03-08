import { Router } from 'express';

import { backEndsRouter } from './BackEnds';
import { knowledgeBaseRouter } from './KnowledgeBase';

const mainRouter = Router({});

mainRouter.use('/backends', backEndsRouter);
mainRouter.use('/knowledgeBase', knowledgeBaseRouter);

export { mainRouter };
