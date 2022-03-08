import { Request, Response } from 'express';
import { objectToDotNotation } from '../../../utils/objectToDotNotation';
import { getBackEndService } from '../../../lib/BackEnd/BackEnd.service';
import { DisplayBackEndEntity } from '../../../lib/BackEnd/persistance/BackEnd.types';
import { UpdateBackendBody, UpdateBackendParams } from './UpdateBackend.types';

export const UpdateBackendRoute = async (
    req: Request<UpdateBackendParams, void, UpdateBackendBody, void>,
    res: Response<{ backend: DisplayBackEndEntity }>
): Promise<Response<{ backend: DisplayBackEndEntity }>> => {
    const {
        params: { backendId, type },
        body: { name, ...paramsProps },
    } = req;

    const backend = await getBackEndService().updateOne(
        { id: backendId, type },
        {
            name,
            ...objectToDotNotation({ params: paramsProps }),
        }
    );

    if (!backend) {
        return res.status(404).send();
    }

    return res.send({
        backend: getBackEndService().formatBackendForDisplay(backend),
    });
};
