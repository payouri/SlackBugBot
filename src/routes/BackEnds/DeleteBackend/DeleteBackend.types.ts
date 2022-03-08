import { z } from 'zod';

export const deleteBackendParamsZod = z
    .object({
        backendId: z.string(),
    })
    .strip();

export type DeleteBackendParams = z.infer<typeof deleteBackendParamsZod>;
