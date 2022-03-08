import { createRequest } from '../../../lib/request';

export const testBackend = (authToken: string) =>
    createRequest<
        {
            params: {
                backendId: string;
            };
        },
        { hasFailed: true; message: string; error?: any } | { hasFailed: false }
    >({
        method: 'get',
        buildUrl: ({ params: { backendId } }) => `/backends/${backendId}/test`,
        authToken,
    });
