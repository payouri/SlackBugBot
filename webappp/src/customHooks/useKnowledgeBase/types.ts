import { IKnowledgeBaseEntry } from '../../requests/knowledgeBase/types';

export interface KnowledgeBaseReducerState {
    search?: string;
    source?: IKnowledgeBaseEntry['source'];
    start: number;
    count: number;
    entries: IKnowledgeBaseEntry[];
    hasMore: boolean;
    loading: boolean;
}

export type UseKnowledgeBaseType = KnowledgeBaseReducerState & {
    loadMore: () => void;
    setSearch: (s: string) => void;
};
