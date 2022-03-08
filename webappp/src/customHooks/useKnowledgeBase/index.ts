import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRequests } from '../useRequest';
import { getKnowledgeBaseState } from './selectors';
import { actions } from './reducer';
import { UseKnowledgeBaseType } from './types';
import { useDebounce } from '../useDebounce';

export const useKnowledgeBase = (): UseKnowledgeBaseType => {
    const { start, count, entries, hasMore, loading, search, ...state } =
        useSelector(getKnowledgeBaseState);
    const dispatch = useDispatch();
    const getKnowledgeEntries = useRequests('getKnowledgeEntries');
    const debouncedSearch = useDebounce(search, 300);

    const loadMoreEntries = useCallback(async () => {
        console.log({ hasMore, loading, search, debouncedSearch });
        if (loading || !hasMore) return;
        dispatch(
            actions.updateState({
                loading: true,
            })
        );

        const response = await getKnowledgeEntries({
            query: {
                start,
                count,
                contains: debouncedSearch ? [debouncedSearch] : undefined,
            },
        });

        if (response.hasFailed) {
        } else {
            console.log({ entries: response.data.entries });

            dispatch(actions.addEntries(response.data.entries));
            dispatch(
                actions.updateState({
                    hasMore: response.data.entries.length === count,
                })
            );
        }
        dispatch(
            actions.updateState({
                loading: false,
            })
        );
    }, [loading, hasMore, debouncedSearch, count, start, search]);

    useEffect(() => {
        dispatch(
            actions.updateState({
                start: 0,
                entries: [],
            })
        );
    }, [debouncedSearch]);

    useEffect(() => {
        loadMoreEntries();
    }, [start, debouncedSearch, count]);

    return {
        start,
        count,
        entries,
        hasMore,
        loading,
        ...state,
        loadMore: () => {
            console.log(hasMore);
            if (!hasMore) return;
            dispatch(
                actions.updateState({
                    start: start + count,
                })
            );
        },
        setSearch: (search: string) => {
            dispatch(
                actions.updateState({
                    search,
                    hasMore: true,
                })
            );
        },
    };
};
