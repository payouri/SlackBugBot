export type HTTPVerb =
    /**
     * The `DELETE` method deletes the specified resource.
     */
    | 'delete'

    /**
     * The `GET` method requests a representation of the specified resource.
     * Requests using GET should only retrieve data.
     */
    | 'get'

    /**
     * The `HEAD` method asks for a response identical to that of a GET request,
     * but without the response body.
     */
    | 'head'

    /**
     * The `OPTIONS` method is used to describe the communication options for the
     * target resource.
     */
    | 'options'

    /**
     * The PATCH method is used to apply partial modifications to a resource.
     */
    | 'patch'

    /**
     * The `POST` method is used to submit an entity to the specified resource,
     * often causing a change in state or side effects on the server.
     */
    | 'post'

    /**
     * The `PUT` method replaces all current representations of the target
     * resource with the request payload.
     */
    | 'put';

export type RequestParams = {
    headers?: Record<string, string>;
    query?: Record<string, string | string[] | number | number[]>;
    params?: Record<string, unknown>;
    body?: Record<string, unknown>;
};

export type ResponseBody = unknown;

export type Response<Body extends unknown = void> =
    | {
          hasFailed: false;
          data: Body;
      }
    | {
          hasFailed: true;
          code: number;
          message: string;
          error: string;
          errorData?: any;
      };

export type Request<
    R extends RequestParams = {},
    T extends ResponseBody = unknown
> = (config: { token: string }) => (params: R) => Promise<Response<T>>;
