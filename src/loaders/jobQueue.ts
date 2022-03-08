import dayjs from 'dayjs';
import { getBackEndService } from '../lib/BackEnd/BackEnd.service';
import { createBackendInstance } from '../lib/BackEnd/Manager';
import { createJobQueue, JobQueueType } from '../lib/JobQueue';
import { getKnowledgeBaseService } from '../lib/KnowledgeBase/KnowledgeBase.service';
import { KnowledgeBaseEntityType } from '../lib/KnowledgeBase/persistance';

const updateKnowledgeData = async () => {
    console.log('updateKnowledgeData starting');
    const backendService = getBackEndService();
    const [dataToUpdate] = await backendService.get({
        sortBy: {
            dataLastFetch: 1,
        },
        count: 1,
        dataLastFetchOlderThan: dayjs().subtract(1, 'hour').toISOString(),
        availableForProcessing: true,
    });

    if (!dataToUpdate) return;

    await backendService.updateOne(
        {
            // eslint-disable-next-line no-underscore-dangle
            id: dataToUpdate._id,
            type: dataToUpdate.type,
        },
        {
            metadata: {
                currentlyProcessing: true,
                processingLockedUntil: dayjs().add(5, 'minutes').toISOString(),
            },
        }
    );

    const backendInstance = createBackendInstance(dataToUpdate);
    const tasks = await backendInstance.get();

    if (!tasks.length) {
        await backendService.updateOne(
            {
                // eslint-disable-next-line no-underscore-dangle
                id: dataToUpdate._id,
                type: dataToUpdate.type,
            },
            {
                dataLastFetch: dayjs().toISOString(),
                'metadata.currentlyProcessing': false,
                'metadata.processingLockedUntil': null,
            }
        );
        return;
    }

    await getKnowledgeBaseService().upsert(
        tasks.reduce<
            Record<string, Omit<KnowledgeBaseEntityType, '_id' | 'source'>>
        >((acc, task) => {
            const formatted = backendInstance.formatData(task);

            return { ...acc, [formatted.metadata.id]: formatted };
        }, {})
    );

    await backendService.updateOne(
        {
            // eslint-disable-next-line no-underscore-dangle
            id: dataToUpdate._id,
            type: dataToUpdate.type,
        },
        {
            dataLastFetch: dayjs().toISOString(),
            'metadata.currentlyProcessing': false,
            'metadata.processingLockedUntil': null,
        }
    );
};

export enum QueueJobsTypes {
    UPDATE_KNOWLEDGE_DATA = 'update_knowledge_data',
}

export const QueueMethodMap = {
    [QueueJobsTypes.UPDATE_KNOWLEDGE_DATA]: {
        fn: updateKnowledgeData,
        options: {
            concurrency: 2,
        },
    },
};

let queue: JobQueueType<typeof QueueMethodMap>;

export const startJobQueue = async () => {
    queue = await createJobQueue({
        jobsMapDefinitions: QueueMethodMap,
    });

    await queue.addPeriodicJob({
        every: '1 minutes',
        job: QueueJobsTypes.UPDATE_KNOWLEDGE_DATA,
        data: undefined,
    });

    return queue;
};

export const getJobQueue = () => {
    if (!queue) {
        throw new TypeError('Queue Not Started');
    }

    return queue;
};
