import { z } from 'zod';

import { BackEndType } from '../../../lib/BackEnd/constants';
import { clickUpEntityBackendParamsZod } from '../../../lib/BackEnd/persistance';

export const updateBackendParamsZod = z
    .object({
        backendId: z.string(),
        type: z.nativeEnum(BackEndType),
    })
    .strip();
export const updateBackendBodyZod = clickUpEntityBackendParamsZod

    .extend({
        name: z.string(),
    })
    .partial()
    .strip();

export type UpdateBackendParams = z.infer<typeof updateBackendParamsZod>;

export type UpdateBackendBody = z.infer<typeof updateBackendBodyZod>;
