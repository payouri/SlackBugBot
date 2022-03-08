import { getKnowledgeBaseService } from './KnowledgeBase.service';
import { CreateKnowledgeBaseParams, KnowledgeBase } from './types';

const createKnowledgeBase = <FormattedParams>({
    query,
    formatSearchParams,
}: CreateKnowledgeBaseParams<FormattedParams>): KnowledgeBase => {
    const search: KnowledgeBase['search'] = (searchParams) =>
        query(formatSearchParams(searchParams));

    return {
        search,
    };
};

let knowledgeBase: KnowledgeBase | undefined;

export const getKnowledgeBase = (): KnowledgeBase => {
    if (!knowledgeBase) {
        const knowledgeBaseService = getKnowledgeBaseService();
        knowledgeBase = createKnowledgeBase<
            Omit<Parameters<typeof knowledgeBaseService['get']>[0], 'sortBy'>
        >({
            query: async (params) => {
                console.log({ params });

                const results = await knowledgeBaseService.get({ ...params });

                return results;
            },
            formatSearchParams: ({
                source,
                contains,
                exclude,
                count,
                start,
            }) => {
                let textSearch = '';
                if (contains) {
                    textSearch = `${
                        Array.isArray(contains)
                            ? contains.map((c) => `"${c}"`).join(' ')
                            : `"${contains}"`
                    }`;
                }
                if (exclude) {
                    textSearch += ` ${
                        Array.isArray(exclude)
                            ? exclude.map((e) => `"-${e}"`).join(' ')
                            : `"-${exclude}"`
                    }`;
                }
                return {
                    textSearch,
                    source,
                    start: start || 0,
                    count: count || 10,
                };
            },
        });
    }

    return knowledgeBase;
};
