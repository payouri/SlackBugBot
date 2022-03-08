import { Router } from 'express';
import { GetKnowledgeBaseEntries } from './GetKnowledgeBaseEntries';

const knowledgeBaseRouter = Router({});

knowledgeBaseRouter.get('/', GetKnowledgeBaseEntries);

export { knowledgeBaseRouter };
