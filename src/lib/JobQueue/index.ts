import {
    Agenda,
    JobAttributes,
    JobAttributesData,
    DefineOptions,
    Processor,
    Job as AgendaJob,
} from 'agenda';
import { MONGO_URI } from '../../config';

export type JobQueueType<
    JobTypes extends Record<
        string,
        {
            fn: <T extends JobAttributesData>(
                param: JobAttributes<T>
            ) => Promise<void>;
            options?: DefineOptions;
        }
    >
> = {
    addPeriodicJob: <Job extends keyof JobTypes>(param: {
        job: Job;
        data: Parameters<JobTypes[Job]['fn']>[0]['data'];
        every: string;
    }) => Promise<void>;
    runNow: <Job extends keyof JobTypes>(param: {
        job: Job;
        data: Parameters<JobTypes[Job]['fn']>[0]['data'];
    }) => Promise<void>;
    addJob: <Job extends keyof JobTypes>(param: {
        job: Job;
        data: Parameters<JobTypes[Job]['fn']>[0]['data'];
    }) => Promise<void>;
    scheduleJob: <Job extends keyof JobTypes>(param: {
        job: Job;
        date: Date;
        data: Parameters<JobTypes[Job]['fn']>[0]['data'];
    }) => Promise<void>;
};

export const createJobQueue = async <
    JobTypes extends Record<
        string,
        {
            fn: <T extends JobAttributesData = any>(
                param: JobAttributes<T>
            ) => Promise<void>;
            options?: DefineOptions;
        }
    >
>(params: {
    jobsMapDefinitions: JobTypes;
}): Promise<JobQueueType<JobTypes>> => {
    const { jobsMapDefinitions } = params;

    const queue = new Agenda({
        db: {
            address: MONGO_URI,
            collection: 'job_queue',
        },
        defaultConcurrency: 2,
        processEvery: '10 seconds',
    });

    Object.entries(jobsMapDefinitions).forEach(([name, job]) => {
        queue.define(name, job.options ?? {}, async (jobData: AgendaJob) => {
            try {
                await job.fn(jobData.attrs);
            } catch (err) {
                console.error(err);
            }
        });
    });

    await new Promise<void>((resolve) => {
        queue.on('ready', () => {
            resolve();
        });
    });

    await queue.start();
    return {
        addPeriodicJob: async <Job extends keyof JobTypes>(param: {
            job: Job;
            data: Parameters<JobTypes[Job]['fn']>[0]['data'];
            every: string;
        }) => {
            console.log({ param });
            await queue.every(param.every, param.job as string);
        },
        runNow: async <Job extends keyof JobTypes>(param: {
            job: Job;
            data: Parameters<JobTypes[Job]['fn']>[0]['data'];
        }) => {
            await queue.now(param.job as string, param.data);
        },
        addJob: async <Job extends keyof JobTypes>(param: {
            job: Job;
            data: Parameters<JobTypes[Job]['fn']>[0]['data'];
        }) => {
            const job = queue.create(param.job as string, param.data);
            await job.save();
        },
        scheduleJob: async <Job extends keyof JobTypes>(param: {
            job: Job;
            date: Date;
            data: Parameters<JobTypes[Job]['fn']>[0]['data'];
        }) => {
            await queue.schedule(param.date, param.job as string, param.data);
        },
    };
};
