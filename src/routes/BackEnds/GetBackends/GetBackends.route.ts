import { Request, Response } from 'express';

import { getBackEndService } from '../../../lib/BackEnd/BackEnd.service';
import { DisplayBackEndEntity } from '../../../lib/BackEnd/persistance/BackEnd.types';
import { GetBackendsQuery } from './GetBackends.types';

const GetBackendsRoute = async (
    req: Request<void, void, void, GetBackendsQuery>,
    res: Response
): Promise<Response<{ backends: DisplayBackEndEntity[] }>> => {
    const {
        query: { start = 0, count = 20 },
    } = req;

    const backends = await getBackEndService().get({
        start,
        count,
    });

    return res.send({
        backends: backends.map(getBackEndService().formatBackendForDisplay),
    });
};

export { GetBackendsRoute };
