import { RequestHandler } from "express";

import { wrapAsync } from "../../../utils/wrapAsync";
import { CreateBackendRoute } from "./CreateBackend.route";
import { validator } from "./CreateBackend.validator";

export const CreateBackend: RequestHandler[] = [
    validator,
    wrapAsync(CreateBackendRoute),
];
