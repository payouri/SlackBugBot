import { createRequest } from '../../../lib/request';
import { Backend, IBackEnd } from '../types';

export const updateBackend = (authToken: string) =>
    createRequest<
        {
            params: {
                backendId: string;
                type: IBackEnd['type'];
            };
            body: Omit<IBackEnd, '_id' | 'type'>['params'] & {
                name: Backend['name'];
            };
        },
        { backend: Backend }
    >({
        method: 'put',
        authToken,
        buildUrl: ({ params: { backendId, type } }) =>
            `/backends/${backendId}/${type}`,
    });
