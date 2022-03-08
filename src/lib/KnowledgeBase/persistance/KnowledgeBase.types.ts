import { z } from 'zod';
import { BackEndType } from '../../BackEnd/constants';

export const knowledgeBaseZod = z.object({
    _id: z.string(),
    title: z.string(),
    body: z.string(),
    source: z.nativeEnum(BackEndType),
    metadata: z
        .record(z.string(), z.string().or(z.array(z.string())).or(z.number()))
        .and(
            z.object({
                id: z.string().nonempty(),
            })
        ),
});

export const clickUpKnowledgeDataZod = knowledgeBaseZod.extend({
    metadata: z.object({
        url: z.string(),
        tags: z.array(z.string()),
        list: z.string(),
        id: z.string().nonempty(),
    }),
});

export type KnowledgeBaseEntity = z.infer<typeof knowledgeBaseZod>;

export type KnowledgeBaseEntityType = z.infer<typeof clickUpKnowledgeDataZod>;
