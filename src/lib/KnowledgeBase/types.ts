import { z } from 'zod';
import { BackEndType } from '../BackEnd/constants';
import { KnowledgeBaseEntityType } from './persistance/KnowledgeBase.types';

export const knowledgeBaseSearchParamsZod = z
    .object({
        source: z.nativeEnum(BackEndType),
        contains: z.string().or(z.array(z.string())),
        exclude: z.string().or(z.array(z.string())),
        count: z.number().optional(),
        start: z.number().optional(),
    })
    .partial();

export type KnowledgeBaseSearchParams = z.infer<
    typeof knowledgeBaseSearchParamsZod
>;

export type CreateKnowledgeBaseParams<FormattedSearchParams> = {
    formatSearchParams: (
        params: KnowledgeBaseSearchParams
    ) => FormattedSearchParams;
    query: (
        params: FormattedSearchParams
    ) => Promise<KnowledgeBaseEntityType[]>;
};

export type KnowledgeBase = {
    search: (
        searchParams: KnowledgeBaseSearchParams
    ) => Promise<KnowledgeBaseEntityType[]>;
};
