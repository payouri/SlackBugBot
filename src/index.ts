import "./config";

import { init } from "./loaders";
import { startServer } from "./loaders/server";

init(startServer);
