import { z } from 'zod';

export const getSpacesTagsQueryZod = z
    .object({
        spacesIds: z.array(z.string()).min(1),
        apiKey: z.string().optional(),
        teamId: z.string().optional(),
    })
    .strip();

export const getSpacesTagsParamsZod = z
    .object({
        backendId: z.string().optional(),
    })
    .strip();

export type GetSpacesTagsQuery = z.infer<typeof getSpacesTagsQueryZod>;

export type GetSpacesTagsParams = z.infer<typeof getSpacesTagsParamsZod>;
