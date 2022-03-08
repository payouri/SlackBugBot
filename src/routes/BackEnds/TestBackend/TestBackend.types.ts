import { z } from 'zod';

import { clickUpEntityBackendParamsZod } from '../../../lib/BackEnd/persistance';

export const testBackendParamsZod = z
    .object({
        backendId: z.string(),
    })
    .strip();

export const updateBackendBodyZod = clickUpEntityBackendParamsZod.strip();

export type TestBackendParams = z.infer<typeof testBackendParamsZod>;
