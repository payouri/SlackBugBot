import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AuthenticationState } from './types';

const initialState: AuthenticationState = {
    isAuthenticated: false,
    isLoading: false,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setLoading: (state, { payload }: PayloadAction<boolean>) => {
            state.isLoading = payload;
        },
        authenticate: (state, { payload }: PayloadAction<string>) => {
            state.isAuthenticated = true;
            state.token = payload;
        },
        reset: () => ({
            ...initialState,
        }),
    },
});

export const { actions, reducer: authReducer } = authSlice;
