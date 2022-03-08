import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { BackendReducerState } from './types';

const initialState: BackendReducerState = {
    start: 0,
    count: 20,
    hasMore: false,
    loading: false,
    backends: [],
};

export const backendsSlice = createSlice({
    name: 'backends',
    initialState,
    reducers: {
        addBackends: (
            state,
            { payload }: PayloadAction<BackendReducerState['backends']>
        ) => {
            state.backends = [
                ...state.backends.filter(
                    (backend) => !payload.find((p) => backend._id === p._id)
                ),
                ...payload,
            ];
        },
        removeBackends: (state, { payload }: PayloadAction<string[]>) => {
            state.backends = state.backends.filter(
                (backend) => !payload.includes(backend._id)
            );
        },
        updateBackend: (
            state,
            { payload }: PayloadAction<BackendReducerState['backends'][number]>
        ) => {
            state.backends = state.backends.map((backend) =>
                backend._id === payload._id ? payload : backend
            );
        },
        reset: () => ({
            ...initialState,
        }),
        updateState: (
            state,
            { payload }: PayloadAction<Partial<BackendReducerState>>
        ) => ({
            ...state,
            ...payload,
        }),
    },
});

export const { actions, reducer: backendsReducer } = backendsSlice;
