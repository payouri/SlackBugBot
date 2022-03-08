import { createClickUpClient } from '../../clickUpClient';
import { Folder, Space, Task } from '../../clickUpClient/types';
import { BackEndType } from '../constants';
import { BackEnd } from '../Manager/types';
import { ClickUpBackEndEntity } from '../persistance/BackEnd.types';

export type ClickUpBackendType = BackEnd<Task>;

export const createClickUpBackend = ({
    params,
}: ClickUpBackEndEntity): ClickUpBackendType => {
    const { apiKey, teamId, spaceIds, taskTags } = params;

    const cuClient = createClickUpClient({
        apiKey,
        team: teamId,
    });

    const formatData: ClickUpBackendType['formatData'] = (task) => ({
        body: task.text_content,
        title: task.name,
        source: BackEndType.CLICK_UP,
        metadata: {
            url: task.url,
            tags: task.tags.map((t) => t.name),
            list: task.list.id,
            id: task.id,
            status: task.status.status,
        },
    });

    const test: ClickUpBackendType['test'] = async () => {
        try {
            const response = await cuClient.spaces.getSpaces({
                team: teamId,
            });

            if (response.hasFailed) {
                return {
                    hasFailed: true,
                    message: response.message,
                };
            }

            return {
                hasFailed: false,
            };
        } catch (err) {
            if (err instanceof Error) {
                return {
                    hasFailed: true,
                    message: err.message,
                    error: err,
                };
            }
            return {
                hasFailed: true,
                message: 'failed_to_fetch_spaces',
            };
        }
    };

    const get: ClickUpBackendType['get'] = async () => {
        let watchedSpaces: Space[];

        if (spaceIds.length) {
            watchedSpaces = (
                await Promise.allSettled(
                    spaceIds.map(async (spaceId) =>
                        cuClient.spaces.getSpace({
                            spaceId: spaceId.includes('#')
                                ? spaceId.split('#').pop() || ''
                                : spaceId,
                        })
                    )
                )
            ).reduce<Space[]>((acc, val) => {
                if (val.status === 'rejected' || val.value.hasFailed)
                    return acc;
                if (Array.isArray(val)) return val;

                return [...acc, val.value.data];
            }, []);
        } else {
            const result = await cuClient.spaces.getSpaces({});

            if (result.hasFailed) {
                watchedSpaces = [];
            } else {
                watchedSpaces = result.data;
            }
        }

        if (!watchedSpaces.length) return [];

        const folders = (
            await Promise.allSettled(
                watchedSpaces.map(async ({ id: spaceId }) =>
                    cuClient.folders.getFolders({ spaceId })
                )
            )
        )
            .reduce<Folder[][]>((acc, val) => {
                if (val.status === 'rejected' || val.value.hasFailed)
                    return acc;

                return [...acc, val.value.data];
            }, [])
            .flat(1);

        const tasks = (
            await Promise.allSettled(
                folders
                    .map((folder) => folder.lists)
                    .flat(1)
                    .map(async ({ id: listId }) =>
                        cuClient.tasks.getTasks({ listId })
                    )
            )
        ).reduce<Task[]>((acc, result) => {
            if (result.status === 'rejected') return acc;
            const { value } = result;
            if (value.hasFailed === true) return acc;

            return [
                ...acc,
                ...value.data.filter(
                    (task) =>
                        !acc.find((t) => t.id === task.id) &&
                        (!taskTags.length ||
                            task.tags.some((tag) =>
                                taskTags.includes(tag.name)
                            ))
                ),
            ];
        }, []);

        return tasks;
    };

    return {
        formatData,
        get,
        test,
    };
};
