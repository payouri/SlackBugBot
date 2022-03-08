import { createRequest } from '../../../lib/request';
import { Backend, IBackEnd } from '../types';

export const createBackend = (authToken: string) =>
    createRequest<{ body: Omit<IBackEnd, '_id'> }, { backend: Backend }>({
        method: 'post',
        authToken,
        buildUrl: () => '/backends',
    });
