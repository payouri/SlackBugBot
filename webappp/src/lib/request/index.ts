import axios from 'axios';
import { HTTPVerb, RequestParams, ResponseBody, Response } from './types';
import { stringify } from 'query-string';

const BASE_URL = 'http://localhost:5000/api';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 5000,
    paramsSerializer: (p) => stringify(p, { arrayFormat: 'bracket' }),
});

export const createRequest = <
    Req extends RequestParams = RequestParams,
    Res extends ResponseBody = unknown
>(config: {
    method: HTTPVerb;
    authToken: string;
    buildUrl: (params: Pick<Req, 'query' | 'params'>) => string;
}): ((params: Req) => Promise<Response<Res>>) => {
    return async (params) => {
        try {
            const requestParams =
                config.method === 'patch' ||
                config.method === 'put' ||
                config.method === 'post'
                    ? [
                          params.body,
                          {
                              headers: {
                                  ...params.headers,
                                  Authorization: `Bearer ${config.authToken}`,
                              },
                          },
                      ]
                    : [
                          {
                              headers: {
                                  ...params.headers,
                                  Authorization: `Bearer ${config.authToken}`,
                              },
                          },
                      ];
            const response = await axiosInstance[config.method]<Res>(
                config.buildUrl(params),
                ...requestParams
            );

            return {
                hasFailed: false,
                data: response.data,
            };
        } catch (err) {
            if (axios.isAxiosError(err)) {
                return {
                    hasFailed: true,
                    code: err.code ? +err.code : 500,
                    error: err.name,
                    message: err.message,
                    errorData: err.response?.data,
                };
            }
            return {
                hasFailed: true,
                code: 500,
                error: 'request failed',
                message: 'request failed',
                errorData: err,
            };
        }
    };
};
