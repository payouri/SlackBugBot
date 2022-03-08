import axios, { AxiosResponse, AxiosResponseHeaders } from 'axios';

import { CLICK_UP_API_KEY, CLICK_UP_TEAM } from '../../config';
import { Folder, List, Space, Tag, Task } from './types';

export type RequestResult<T> =
    | {
          hasFailed: false;
          data: T;
      }
    | {
          hasFailed: true;
          statusCode: number;
          message: string;
      };

export type ClickUpClient = {
    spaces: {
        getSpaces: (params: {
            team?: string;
        }) => Promise<RequestResult<Space[]>>;
        getSpace: (params: {
            spaceId: string;
        }) => Promise<RequestResult<Space>>;
    };
    folders: {
        getFolders: (param: {
            spaceId: string;
        }) => Promise<RequestResult<Folder[]>>;
        getFolder: (param: {
            folderId: string;
        }) => Promise<RequestResult<Folder>>;
    };
    lists: {
        getLists: (param: {
            folderId: string;
        }) => Promise<RequestResult<List[]>>;
        getList: (param: { listId: string }) => Promise<RequestResult<List>>;
    };
    tags: {
        getTags: (param: { spaceId: string }) => Promise<RequestResult<Tag[]>>;
    };
    tasks: {
        getTasks: (param: { listId: string }) => Promise<RequestResult<Task[]>>;
        getTask: (param: { taskId: string }) => Promise<RequestResult<Task>>;
    };
    // eslint-disable-next-line no-use-before-define
    rateLimitInfo: ReturnType<typeof parseRateLimitHeaders>;
};

let client: ClickUpClient | undefined;

const parseRateLimitHeaders = (headers: AxiosResponseHeaders) => {
    const limit = +headers['x-ratelimit-limit'];
    const remaining = +headers['x-ratelimit-remaining'];
    /** in secs */
    const resetAt = +headers['x-ratelimit-reset'];

    return {
        limit,
        resetAt: new Date(resetAt * 1000).toISOString(),
        remaining,
    };
};

const createClickUpClientInstance = (
    apiKey: string,
    options: {
        team?: string;
    }
): ClickUpClient => {
    const state = {
        rateLimit: {
            resetAt: new Date().toISOString(),
            limit: Infinity,
            remaining: Infinity,
        },
    };
    const wrapRequest = async <T>(
        request: () => Promise<AxiosResponse<T>>
    ): Promise<RequestResult<T>> => {
        try {
            const response = await request();

            state.rateLimit = parseRateLimitHeaders(response.headers);

            return {
                hasFailed: false,
                data: response.data,
            };
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 429) {
                    state.rateLimit.remaining = 0;
                }
                return {
                    hasFailed: true,
                    statusCode: err.response?.status ?? 503,
                    message: err.response?.statusText ?? '',
                };
            }
            return {
                hasFailed: true,
                statusCode: 503,
                message: 'request_failed',
            };
        }
    };

    const axiosInstance = axios.create({
        baseURL: 'https://api.clickup.com/api/v2/',
        timeout: 3000,
        headers: {
            Authorization: apiKey,
        },
    });

    return {
        spaces: {
            getSpaces: async ({ team }) => {
                const teamParam = team ?? options.team;

                const response = await wrapRequest(() =>
                    axiosInstance.get<{
                        spaces: Space[];
                    }>(`/team/${teamParam}/space`)
                );

                if (response.hasFailed === false) {
                    return {
                        hasFailed: false,
                        data: response.data.spaces,
                    };
                }
                return response;
            },
            getSpace: async ({ spaceId }) => {
                const response = await wrapRequest(() =>
                    axiosInstance.get<Space>(`/space/${spaceId}`)
                );

                return response;
            },
        },
        folders: {
            getFolders: async ({ spaceId }) => {
                const response = await wrapRequest(() =>
                    axiosInstance.get<{
                        folders: Folder[];
                    }>(`space/${spaceId}/folder`)
                );

                if (response.hasFailed === false) {
                    return {
                        hasFailed: false,
                        data: response.data.folders,
                    };
                }
                return response;
            },
            getFolder: async ({ folderId }) => {
                const response = await wrapRequest(() =>
                    axiosInstance.get<Folder>(`folder/${folderId}`)
                );

                if (response.hasFailed === false) {
                    return {
                        hasFailed: false,
                        data: response.data,
                    };
                }
                return response;
            },
        },
        lists: {
            getLists: async ({ folderId }) => {
                const response = await wrapRequest(() =>
                    axiosInstance.get<{ lists: List[] }>(
                        `folder/${folderId}/list`
                    )
                );

                if (response.hasFailed === false) {
                    return {
                        hasFailed: false,
                        data: response.data.lists,
                    };
                }
                return response;
            },
            getList: async ({ listId }) => {
                const response = await wrapRequest(() =>
                    axiosInstance.get<List>(`list/${listId}`)
                );

                if (response.hasFailed === false) {
                    return {
                        hasFailed: false,
                        data: response.data,
                    };
                }
                return response;
            },
        },
        tags: {
            getTags: async ({ spaceId }) => {
                const response = await wrapRequest(() =>
                    axiosInstance.get<{ tags: Tag[] }>(`space/${spaceId}/tag`)
                );

                if (response.hasFailed === false) {
                    return {
                        hasFailed: false,
                        data: response.data.tags,
                    };
                }
                return response;
            },
        },
        tasks: {
            getTask: async ({ taskId }) => {
                const response = await wrapRequest(() =>
                    axiosInstance.get<Task>(`task/${taskId}`)
                );

                if (response.hasFailed === false) {
                    return {
                        hasFailed: false,
                        data: response.data,
                    };
                }
                return response;
            },
            getTasks: async ({ listId }) => {
                const response = await wrapRequest(() =>
                    axiosInstance.get<{
                        tasks: Task[];
                    }>(`list/${listId}/task`)
                );

                if (response.hasFailed === false) {
                    return {
                        hasFailed: false,
                        data: response.data.tasks,
                    };
                }
                return response;
            },
        },
        get rateLimitInfo() {
            return state.rateLimit;
        },
    };
};

export const createClickUpClient = ({
    apiKey,
    team,
}: {
    apiKey: string;
    team: string;
}): ClickUpClient =>
    createClickUpClientInstance(apiKey, {
        team,
    });

export const getClickUpClient = (): ClickUpClient => {
    if (!client)
        client = createClickUpClientInstance(CLICK_UP_API_KEY, {
            team: CLICK_UP_TEAM,
        });
    return client;
};

// getClickUpClient()
//     .spaces.getSpaces({})
//     .then(async (spaces) => {
//         if (spaces.hasFailed) return;
//         const a = await getClickUpClient().folders.getFolders({
//             spaceId: spaces.data[0].id,
//         });
//         console.log(a);
//     });
// getClickUpClient()
//     .folders.getFolder({ folderId: '74481008' })
//     .then((r) => {
//         if (r.hasFailed) return;
//         console.log(r.data.lists);
//     });
// getClickUpClient()
//     .lists.getList({ listId: '146550445' })
//     .then((r) => {
//         if (r.hasFailed) return;
//         console.log(r.data);
//     });
