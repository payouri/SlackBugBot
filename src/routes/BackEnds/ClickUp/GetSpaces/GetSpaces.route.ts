import { Request, Response } from 'express';
import { getBackEndService } from '../../../../lib/BackEnd/BackEnd.service';
import { BackEndType } from '../../../../lib/BackEnd/constants';
import { createClickUpClient } from '../../../../lib/clickUpClient';
import { Space, Tag } from '../../../../lib/clickUpClient/types';
import { GetSpacesParams, GetSpacesQuery } from './GetSpaces.types';

const GetSpacesRoute = async (
    req: Request<GetSpacesParams, void, void, GetSpacesQuery>,
    res: Response<{ spaces: Space[] }>
): Promise<Response<{ spaces: Space[] }>> => {
    const {
        params: { backendId },
        query: { teamId, apiKey },
    } = req;

    if (backendId) {
        const backend = await getBackEndService().getById(backendId);
        if (!backend || backend.type !== BackEndType.CLICK_UP) {
            return res.status(404).send();
        }

        const cuClient = createClickUpClient({
            apiKey: backend.params.apiKey,
            team: backend.params.teamId,
        });

        const spaces = await cuClient.spaces.getSpaces({
            team: backend.params.teamId,
        });

        if (spaces.hasFailed) {
            return res.status(400).send();
        }

        return res.send({
            spaces: spaces.data,
        });
    }
    if (teamId && apiKey) {
        const cuClient = createClickUpClient({
            apiKey,
            team: teamId,
        });

        const spaces = await cuClient.spaces.getSpaces({
            team: teamId,
        });

        if (spaces.hasFailed) {
            return res.status(400).send();
        }

        return res.send({
            spaces: spaces.data,
        });
    }
    return res.status(400).send();
};

export { GetSpacesRoute };
