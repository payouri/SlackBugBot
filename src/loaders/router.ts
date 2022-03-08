import cors from "cors";
import express from "express";
import helmet from "helmet";

import { mainRouter } from "../routes";

export const setupRouter = () => {
    const app = express();

    app.use(cors());
    app.use(helmet());
    app.use(express.json());
    app.use(
        express.urlencoded({
            extended: true,
        })
    );

    app.use('/api', mainRouter);

    return {
        app,
    };
};
