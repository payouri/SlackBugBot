import dayjs from 'dayjs';
import { Model, UpdateQuery } from 'mongoose';

import { BackEndType } from './constants';
import { createBackendInstance, formatBackendForDisplay } from './Manager';
import {
    BackEndEntity,
    DisplayBackEndEntity,
    getBackEndModel,
} from './persistance';

const BackendService = (model: Model<BackEndEntity>) => ({
    formatBackendForDisplay: (backend: BackEndEntity): DisplayBackEndEntity => {
        const instance = createBackendInstance(backend);

        const hasTestFn = !!instance.test;

        return {
            ...formatBackendForDisplay(backend),
            hasTestFn,
        };
    },
    create: async (
        data: Omit<BackEndEntity, '_id'> | Omit<BackEndEntity, '_id'>[]
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
        { id, type }: { id: string; type: BackEndType },
        data: UpdateQuery<Omit<BackEndEntity, 'type' | '_id'>>
    ): Promise<null | BackEndEntity> => {
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
    getById: (id: string): Promise<BackEndEntity | null> =>
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
        dataLastFetchOlderThan,
        sortBy,
        availableForProcessing,
    }: {
        ids?: string[];
        count?: number;
        start?: number;
        dataLastFetchOlderThan?: string | Date;
        sortBy?: {
            [K in keyof BackEndEntity]?: -1 | 1;
        };
        availableForProcessing?: boolean;
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
                    ...(dataLastFetchOlderThan
                        ? {
                              $or: [
                                  {
                                      dataLastFetch: {
                                          $lt: dataLastFetchOlderThan,
                                      },
                                  },
                                  {
                                      dataLastFetch: {
                                          $exists: false,
                                      },
                                  },
                              ],
                          }
                        : {}),

                    ...(availableForProcessing
                        ? {
                              $or: [
                                  {
                                      'metadata.currentlyProcessing': {
                                          $exists: false,
                                      },
                                  },
                                  { 'metadata.currentlyProcessing': false },
                                  {
                                      'metadata.processingLockedUntil': {
                                          $lte: dayjs().toISOString(),
                                      },
                                  },
                              ],
                          }
                        : {}),
                },
                {},
                {
                    skip: start,
                    limit: count,
                    sort: sortBy,
                }
            )
            .lean()
            .exec(),
});

let backendService: ReturnType<typeof BackendService> | undefined;

export const getBackEndService = (
    backendModel: Model<BackEndEntity> = getBackEndModel()
) => {
    if (!backendService) {
        backendService = BackendService(backendModel);
    }

    return backendService;
};
