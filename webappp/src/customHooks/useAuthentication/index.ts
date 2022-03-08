import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocalStorage } from '../useLocalStorage';
import { getAuthenticationState } from './selectors';
import { UseAuthenticationParams, UseAuthenticationType } from './types';
import { actions } from './reducer';

const LOCAL_STORAGE_KEY = 'auth_bearer';

export const useAuthentication = (
    params: UseAuthenticationParams
): UseAuthenticationType => {
    const state = useSelector(getAuthenticationState);
    const dispatch = useDispatch();

    const { value: storedToken, setValue: setStoredToken } = useLocalStorage({
        key: LOCAL_STORAGE_KEY,
    });

    const authenticate = async (): Promise<void> => {
        dispatch(actions.setLoading(true));
        if (params.getBearer) {
            const bearer = await params.getBearer();
            setStoredToken(bearer);
            dispatch(actions.authenticate(bearer));
        } else {
            if (storedToken) dispatch(actions.authenticate(storedToken));
        }
        dispatch(actions.setLoading(false));
    };

    useEffect(() => {
        authenticate();
        return () => {
            setStoredToken(null);
        };
    }, [params.getBearer]);

    return {
        ...state,
        signOut: () => {
            dispatch(actions.reset());
            setStoredToken(null);
        },
    };
};
