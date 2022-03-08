import { createRequest } from '../../../../lib/request';
import { Space } from '../../types';

export const getSpaces = (authToken: string) =>
    createRequest<
        | { params: { backendId: string }; query?: undefined }
        | { query: { apiKey: string; teamId: string }; params?: undefined },
        { spaces: Space[] }
    >({
        method: 'get',
        authToken,
        buildUrl: (reqParams) =>
            reqParams.params && 'backendId' in reqParams.params
                ? `/backends/clickUp/${reqParams.params.backendId}/spaces`
                : `/backends/clickUp/spaces?apiKey=${reqParams.query?.apiKey}&teamId=${reqParams.query?.teamId}`,
    });
