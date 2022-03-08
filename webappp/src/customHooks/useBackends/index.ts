import { actions } from './reducer';
import { getBackendsState } from './selectors';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useRequests } from '../useRequest';
import { UseBackendType } from './types';
import { Backend } from '../../requests/backends/types';

export const useBackends = (): UseBackendType => {
    const { start, count, backends, hasMore, ...state } =
        useSelector(getBackendsState);
    const dispatch = useDispatch();
    const getBackends = useRequests('getBackends');

    const loadPage = async () => {
        dispatch(
            actions.updateState({
                loading: true,
            })
        );
        const response = await getBackends({
            query: {
                start,
                count,
            },
        });

        if (response.hasFailed) {
            // Todo: handle error
            return;
        }

        if (response.data.backends.length) {
            dispatch(actions.addBackends(response.data.backends));
        } else {
            actions.updateState({
                hasMore: false,
            });
        }
        dispatch(
            actions.updateState({
                loading: false,
            })
        );
    };

    const loadMore = () => {
        if (!hasMore) return;

        dispatch(
            actions.updateState({
                start: start + count,
            })
        );
    };

    useEffect(() => {
        if (!backends.length) loadPage();
    }, [start, count, backends.length]);

    return {
        start,
        count,
        backends,
        hasMore,
        loadMore,
        push: (backends: Backend[]) => {
            dispatch(actions.addBackends(backends));
        },
        updateOne: (data: Backend) => {
            dispatch(actions.updateBackend(data));
        },
        deleteOne: (id: string) => {
            dispatch(actions.removeBackends([id]));
        },
        ...state,
    };
};
