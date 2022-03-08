import { Request, Response } from 'express';
import { getKnowledgeBase } from '../../../lib/KnowledgeBase';
import { KnowledgeBaseEntityType } from '../../../lib/KnowledgeBase/persistance/KnowledgeBase.types';
import { GetKnowledgeBaseEntriesQuery } from './GetKnowledgeBaseEntries.types';

const GetKnowledgeBaseEntriesRoute = async (
    req: Request<void, void, void, GetKnowledgeBaseEntriesQuery>,
    res: Response<{ entries: KnowledgeBaseEntityType[] }>
): Promise<Response<{ entries: KnowledgeBaseEntityType[] }>> => {
    const { query } = req;

    const entries = await getKnowledgeBase().search(query);

    return res.send({
        entries,
    });
};

export { GetKnowledgeBaseEntriesRoute };
