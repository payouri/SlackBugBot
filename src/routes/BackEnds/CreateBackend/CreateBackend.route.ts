import { Request, Response } from 'express';

import { getBackEndService } from '../../../lib/BackEnd/BackEnd.service';
import { BackEndEntity } from '../../../lib/BackEnd/persistance/BackEnd.types';
import { CreateBackendBody } from './CreateBackend.types';

export const CreateBackendRoute = async (
    req: Request<Record<string, string>, void, CreateBackendBody, void>,
    res: Response<{ backend: BackEndEntity }>
): Promise<Response<{ backend: BackEndEntity }>> => {
    const { body } = req;

    const [backend] = await getBackEndService().create(body);

    if (!backend) {
        res.status(400).send();
    }

    return res.send({ backend });
};
