import { Model, UpdateQuery, FilterQuery } from 'mongoose';
import { getKnowledgeBaseModel, KnowledgeBaseEntityType } from './persistance';
import { objectToDotNotation } from '../../utils/objectToDotNotation';

const KnowledgeBaseService = (model: Model<KnowledgeBaseEntityType>) => ({
    create: async (
        data:
            | Omit<KnowledgeBaseEntityType, '_id'>
            | Omit<KnowledgeBaseEntityType, '_id'>[]
    ) => {
        const result = await model.insertMany(
            !Array.isArray(data) ? [data] : data,
            {
                lean: true,
            }
        );

        return result;
    },
    delete: async ({ id }: { id: string }) => {
        const result = await model.deleteOne({
            _id: id,
        });

        return !!result.deletedCount;
    },
    updateOne: async (
        { id, type }: { id: string; type: KnowledgeBaseEntityType['source'] },
        data: UpdateQuery<Omit<KnowledgeBaseEntityType, 'source' | '_id'>>
    ): Promise<null | KnowledgeBaseEntityType> => {
        const result = await model
            .findOneAndUpdate(
                {
                    _id: id,
                    type,
                },
                data,
                {
                    new: true,
                }
            )
            .lean()
            .exec();

        return result;
    },
    upsert: async (
        params: Record<
            string,
            UpdateQuery<Omit<KnowledgeBaseEntityType, '_id'>>
        >
    ) => {
        await model.bulkWrite(
            Object.entries(params).map<{
                updateOne: {
                    filter: FilterQuery<KnowledgeBaseEntityType>;
                    update: UpdateQuery<
                        Omit<KnowledgeBaseEntityType, 'source'>
                    >;
                    upsert: true;
                };
            }>(([key, { source, ...update }]) => ({
                updateOne: {
                    filter: {
                        'metadata.id': key,
                        source,
                    },
                    update: {
                        $set: objectToDotNotation(update),
                    },
                    upsert: true,
                },
            })),
            {
                ordered: false,
            }
        );
    },
    getById: (id: string): Promise<KnowledgeBaseEntityType | null> =>
        model
            .findOne({
                _id: id,
            })
            .lean()
            .exec(),
    get: ({
        ids,
        count,
        start,
        sortBy,
        textSearch,
        source,
    }: {
        ids?: string[];
        count?: number;
        start?: number;
        sortBy?: {
            [K in keyof KnowledgeBaseEntityType]?: -1 | 1;
        };
        textSearch?: string;
        source?: KnowledgeBaseEntityType['source'];
    }) =>
        model
            .find(
                {
                    ...(ids?.length
                        ? {
                              _id: {
                                  $in: ids,
                              },
                          }
                        : {}),
                    ...(textSearch
                        ? {
                              $text: {
                                  $search: textSearch,
                                  $caseSensitive: false,
                                  $diacriticSensitive: false,
                              },
                          }
                        : {}),
                    ...(source ? { source } : {}),
                },
                {
                    ...(textSearch ? { score: { $meta: 'textScore' } } : {}),
                },
                {
                    skip: start,
                    limit: count,
                    sort: {
                        ...sortBy,
                        ...(textSearch
                            ? { score: { $meta: 'textScore' } }
                            : {}),
                    },
                }
            )
            .lean()
            .exec(),
});

let knowledgeBaseService: ReturnType<typeof KnowledgeBaseService> | undefined;

export const getKnowledgeBaseService = (
    knowledgeBaseModel: Model<KnowledgeBaseEntityType> = getKnowledgeBaseModel()
): ReturnType<typeof KnowledgeBaseService> => {
    if (!knowledgeBaseService) {
        knowledgeBaseService = KnowledgeBaseService(knowledgeBaseModel);
    }

    return knowledgeBaseService;
};
