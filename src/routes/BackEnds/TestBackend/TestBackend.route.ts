import { Request, Response } from 'express';

import { getBackEndService } from '../../../lib/BackEnd/BackEnd.service';
import { createBackendInstance } from '../../../lib/BackEnd/Manager';
import { TestBackendParams } from './TestBackend.types';

export const TestBackendRoute = async (
    req: Request<TestBackendParams, void, void, void>,
    res: Response<
        | { hasFailed: true; error?: Error; message: string }
        | { hasFailed: false }
    >
): Promise<
    Response<
        | { hasFailed: true; error?: Error; message: string }
        | { hasFailed: false }
    >
> => {
    const {
        params: { backendId },
    } = req;

    const backend = await getBackEndService().getById(backendId);

    if (!backend) {
        return res.status(404).send();
    }

    const backendInstance = createBackendInstance(backend);
    if (!backendInstance.test) {
        return res.status(400).send();
    }

    return res.send(await backendInstance.test());
};
