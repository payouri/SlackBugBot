import { createRequest } from '../../../lib/request';
import { Backend } from '../types';

export const getBackends = (authToken: string) =>
    createRequest<
        {
            query: { start: number; count: number };
        },
        { backends: Backend[] }
    >({
        method: 'get',
        buildUrl: ({ query }) =>
            `/backends?start=${query.start}&count=${query.count}`,
        authToken,
    });
