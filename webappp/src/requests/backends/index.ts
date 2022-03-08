import { createBackend } from './createBackend';
import { getBackends } from './getBackends';
import { updateBackend } from './updateBackend';
import { testBackend } from './testBackend';
import { deleteBackend } from './deleteBackend';
import { clickUpBackendRequests } from './clickUp';

export const backendRequests = {
    createBackend,
    getBackends,
    testBackend,
    updateBackend,
    deleteBackend,
    ...clickUpBackendRequests,
};
