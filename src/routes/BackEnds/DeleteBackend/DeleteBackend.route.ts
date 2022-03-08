import { Request, Response } from 'express';

import { getBackEndService } from '../../../lib/BackEnd/BackEnd.service';
import { DeleteBackendParams } from './DeleteBackend.types';

export const DeleteBackendRoute = async (
    req: Request<DeleteBackendParams, void, void, void>,
    res: Response<void>
): Promise<Response<void>> => {
    const {
        params: { backendId },
    } = req;

    const deleted = await getBackEndService().delete({
        id: backendId,
    });

    if (!deleted) {
        return res.status(404).send();
    }

    return res.status(204).send();
};
