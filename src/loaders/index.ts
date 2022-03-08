import cluster from "cluster";
import os from "os";

import { NODE_ENV } from "../config";

export const init = (callback: (...args: any[]) => any) => {
    const cpus = NODE_ENV === 'development' ? 1 : os.cpus().length;

    if (cluster.isPrimary) {
        for (let i = 0; i < cpus; i += 1) {
            const worker = cluster.fork();

            worker.on('message', (message) => {
                console.log(`[${worker.process.pid} to MASTER]`, message);
            });
        }

        cluster.on('exit', (worker) => {
            console.warn(`[${worker.process.pid}]`, {
                message: 'Process terminated. Restarting.',
            });

            cluster.fork();
        });
    } else {
        callback();
    }
};
