import { z } from 'zod';

export const getSpacesQueryZod = z
    .object({
        apiKey: z.string().optional(),
        teamId: z.string().optional(),
    })
    .strip();

export const getSpacesParamsZod = z
    .object({
        backendId: z.string().optional(),
    })
    .strip();

export type GetSpacesParams = z.infer<typeof getSpacesParamsZod>;

export type GetSpacesQuery = z.infer<typeof getSpacesQueryZod>;
