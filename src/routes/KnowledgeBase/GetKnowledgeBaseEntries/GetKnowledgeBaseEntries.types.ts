import { z } from 'zod';
import { knowledgeBaseSearchParamsZod } from '../../../lib/KnowledgeBase/types';

export const getKnowledgeBaseEntriesQueryZod = knowledgeBaseSearchParamsZod
    .extend({
        start: z
            .string()
            .regex(/^\d+$/)
            .optional()
            .transform((n) => (typeof n === 'string' ? +n : n)),
        count: z
            .string()
            .regex(/^\d+$/)
            .optional()
            .transform((n) => (typeof n === 'string' ? +n : n)),
    })
    .strip()
    .partial();

export type GetKnowledgeBaseEntriesQuery = z.infer<
    typeof getKnowledgeBaseEntriesQueryZod
>;
