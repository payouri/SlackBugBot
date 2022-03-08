import { Backend } from '../../requests/backends/types';

export interface BackendReducerState {
    start: number;
    count: number;
    hasMore: boolean;
    backends: Backend[];
    loading: boolean;
}

export type UseBackendType = BackendReducerState & {
    updateOne: (backend: Backend) => void;
    deleteOne: (id: string) => void;
    push: (backends: Backend[]) => void;
    loadMore: () => void;
};
