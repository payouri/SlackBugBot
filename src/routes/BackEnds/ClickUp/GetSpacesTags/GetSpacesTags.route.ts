import { Request, Response } from 'express';
import { getBackEndService } from '../../../../lib/BackEnd/BackEnd.service';
import { BackEndType } from '../../../../lib/BackEnd/constants';
import { createClickUpClient } from '../../../../lib/clickUpClient';
import { Tag } from '../../../../lib/clickUpClient/types';
import { GetSpacesTagsParams, GetSpacesTagsQuery } from './GetSpacesTags.types';

const GetSpacesTagsRoute = async (
    req: Request<GetSpacesTagsParams, void, void, GetSpacesTagsQuery>,
    res: Response<{ tags: Tag[] }>
): Promise<Response<{ tags: Tag[] }>> => {
    const {
        params: { backendId },
        query: { spacesIds, teamId, apiKey },
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

        const tags = (
            await Promise.all(
                spacesIds.map((spaceId) => cuClient.tags.getTags({ spaceId }))
            )
        )
            .flat(1)
            .filter((response) => !response.hasFailed);

        if (!tags.length) {
            return res.status(400).send();
        }

        return res.send({
            tags: [
                ...new Set(
                    tags
                        .map((response) =>
                            response.hasFailed ? [] : response.data
                        )
                        .flat(1)
                ),
            ],
        });
    }
    if (teamId && apiKey) {
        const cuClient = createClickUpClient({
            apiKey,
            team: teamId,
        });

        const tags = (
            await Promise.all(
                spacesIds.map((spaceId) => cuClient.tags.getTags({ spaceId }))
            )
        )
            .flat(1)
            .filter((response) => !response.hasFailed);

        if (!tags.length) {
            return res.status(400).send();
        }

        return res.send({
            tags: [
                ...new Set(
                    tags
                        .map((response) =>
                            response.hasFailed ? [] : response.data
                        )
                        .flat(1)
                ),
            ],
        });
    }

    return res.status(400).send();
};

export { GetSpacesTagsRoute };
