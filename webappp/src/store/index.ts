import { configureStore } from '@reduxjs/toolkit';

import { knowledgeBaseReducer } from '../customHooks/useKnowledgeBase/reducer';
import { backendsReducer } from '../customHooks/useBackends/reducer';
import { authReducer } from '../customHooks/useAuthentication/reducer';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        backends: backendsReducer,
        knowledgeBase: knowledgeBaseReducer,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
