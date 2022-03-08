import { createRequest } from '../../../../lib/request';
import { Tag } from '../../types';
import { stringify } from 'query-string';

export const getTags = (authToken: string) =>
    createRequest<
        | { params: { backendId: string }; query: { spacesIds: string[] } }
        | {
              query: { apiKey: string; teamId: string; spacesIds: string[] };
              params?: undefined;
          },
        { tags: Tag[] }
    >({
        method: 'get',
        authToken,
        buildUrl: (reqParams) =>
            reqParams.params?.backendId
                ? `/backends/clickUp/${
                      reqParams.params?.backendId
                  }/tags?${stringify(
                      {
                          spacesIds: reqParams.query.spacesIds,
                      },
                      {
                          arrayFormat: 'bracket',
                      }
                  )}`
                : `/backends/clickUp/tags?apiKey=${
                      'apiKey' in reqParams.query && reqParams.query.apiKey
                  }&teamId=${
                      'teamId' in reqParams.query && reqParams.query.teamId
                  }&${stringify(
                      {
                          spacesIds: reqParams.query.spacesIds,
                      },
                      {
                          arrayFormat: 'bracket',
                      }
                  )}`,
    });
