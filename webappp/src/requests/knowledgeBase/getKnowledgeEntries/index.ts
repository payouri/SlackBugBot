import { stringify } from 'query-string';
import { createRequest } from '../../../lib/request';
import { IKnowledgeBaseEntry } from '../types';

export const getKnowledgeEntries = (authToken: string) =>
    createRequest<
        {
            query: {
                start: number;
                count: number;
                source?: IKnowledgeBaseEntry['source'];
                contains?: string[];
            };
        },
        { entries: IKnowledgeBaseEntry[] }
    >({
        method: 'get',
        buildUrl: ({ query }) => `/knowledgeBase?${stringify(query)}`,
        authToken,
    });
