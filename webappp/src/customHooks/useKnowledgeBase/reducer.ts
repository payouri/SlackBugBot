import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { KnowledgeBaseReducerState } from './types';

const initialState: KnowledgeBaseReducerState = {
    start: 0,
    count: 20,
    hasMore: true,
    loading: false,
    entries: [],
};

export const knowledgeBaseSlice = createSlice({
    name: 'backends',
    initialState,
    reducers: {
        addEntries: (
            state,
            { payload }: PayloadAction<KnowledgeBaseReducerState['entries']>
        ) => {
            state.entries = [
                ...state.entries.filter(
                    (entry) => !payload.find((p) => entry._id === p._id)
                ),
                ...payload,
            ];
        },
        removeEntries: (state, { payload }: PayloadAction<string[]>) => {
            state.entries = state.entries.filter(
                (entry) => !payload.includes(entry._id)
            );
        },
        updateBackend: (
            state,
            {
                payload,
            }: PayloadAction<KnowledgeBaseReducerState['entries'][number]>
        ) => {
            state.entries = state.entries.map((backend) =>
                backend._id === payload._id ? payload : backend
            );
        },
        reset: () => ({
            ...initialState,
        }),
        updateState: (
            state,
            { payload }: PayloadAction<Partial<KnowledgeBaseReducerState>>
        ) => ({
            ...state,
            ...payload,
        }),
    },
});

export const { actions, reducer: knowledgeBaseReducer } = knowledgeBaseSlice;
