import { z } from 'zod';

import { BackEndType } from '../constants';

export const baseBackEndEntityZod = z.object({
    _id: z.string(),
    dataLastFetch: z.string().optional(),
    name: z.string().optional(),
    type: z.nativeEnum(BackEndType),
    params: z.record(z.union([z.string().optional(), z.number().optional()])),
    metadata: z
        .object({
            currentlyProcessing: z.boolean().optional(),
            processingLockedUntil: z.string().optional(),
        })
        .optional(),
});

export const clickUpEntityBackendParamsZod = z.object({
    apiKey: z.string(),
    teamId: z.string(),
    taskTags: z.array(z.string()),
    spaceIds: z.array(z.string()),
});

export const clickUpEntityBackendZod = baseBackEndEntityZod.extend({
    type: z.literal(BackEndType.CLICK_UP),
    params: clickUpEntityBackendParamsZod,
});

export const entityBackendZod = clickUpEntityBackendZod;

export const backEndMetadataZod = z.object({
    hasTestFn: z.boolean(),
});
