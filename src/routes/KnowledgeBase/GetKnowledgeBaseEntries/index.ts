import { RequestHandler } from 'express';

import { wrapAsync } from '../../../utils/wrapAsync';
import { GetKnowledgeBaseEntriesRoute } from './GetKnowledgeBaseEntries.route';
import { validator } from './GetKnowledgeBaseEntries.validator';

export const GetKnowledgeBaseEntries: RequestHandler[] = [
    validator,
    wrapAsync(GetKnowledgeBaseEntriesRoute),
];
