import { createRequest } from '../../../lib/request';
import { Backend } from '../types';

export const deleteBackend = (authToken: string) =>
    createRequest<
        {
            params: {
                backendId: string;
            };
        },
        { backend: Backend }
    >({
        method: 'delete',
        authToken,
        buildUrl: ({ params: { backendId } }) => `/backends/${backendId}`,
    });
