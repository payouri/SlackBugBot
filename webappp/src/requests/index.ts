import { backendRequests } from './backends';
import { knowledgeBaseRequests } from './knowledgeBase';

export const requests = {
    ...backendRequests,
    ...knowledgeBaseRequests,
};
