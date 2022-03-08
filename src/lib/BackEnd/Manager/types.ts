import { KnowledgeBaseEntityType } from '../../KnowledgeBase/persistance/KnowledgeBase.types';

export type BackEnd<Data extends Record<string, unknown>> = {
    get: () => Promise<Data[]>;
    formatData: (data: Data) => Omit<KnowledgeBaseEntityType, '_id'>;
    test?: () => Promise<
        | { hasFailed: true; error?: Error; message: string }
        | { hasFailed: false }
    >;
};
