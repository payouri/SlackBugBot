/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';

export const wrapAsync: (
    route: (
        req: Request<any, any, any, any>,
        res: Response<any, any>,
        next: NextFunction
    ) => Promise<Response<any, any>>
) => (
    req: Request<any, any, any, any>,
    res: Response<any, any>,
    next: NextFunction
) => Promise<void> =
    (
        route: (
            req: Request<any, any, any, any>,
            res: Response<any, any>,
            next: NextFunction
        ) => Promise<Response<any, any>>
    ) =>
    async (req, res, next) => {
        try {
            await route(req, res, next);
        } catch (err) {
            next(err);
        }
    };
