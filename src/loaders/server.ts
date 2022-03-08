import { PORT } from '../config';
import { loginToDatabase } from './mongo';
import { QueueJobsTypes, startJobQueue } from './jobQueue';
import { setupRouter } from './router';

export const startServer = async () => {
    await loginToDatabase();

    const { app } = setupRouter();
    const queue = await startJobQueue();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};
