import { useMemo } from 'react';
import { requests } from '../requests';
import { useAuthentication } from './useAuthentication';

const buildRequests = (authToken: string) =>
    Object.keys(requests).reduce<{
        [K in keyof typeof requests]?: ReturnType<typeof requests[K]>;
    }>(
        (acc, requestType) => ({
            ...acc,
            [requestType]:
                requests[requestType as keyof typeof requests](authToken),
        }),
        {}
    );

export const useRequests = <T extends keyof typeof requests>(
    request: T
): ReturnType<typeof requests[T]> => {
    const { token = '' } = useAuthentication({});

    const builtRequests = useMemo(() => buildRequests(token), [token]);

    return builtRequests[request] as ReturnType<typeof requests[T]>;
};
