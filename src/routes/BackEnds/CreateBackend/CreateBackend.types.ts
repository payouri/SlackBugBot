import { z } from 'zod';

import { entityBackendZod } from '../../../lib/BackEnd/persistance';

export const createBackendBodyZod = entityBackendZod
    .omit({
        _id: true,
    })
    .strict()
    .strip();

export type CreateBackendBody = z.infer<typeof createBackendBodyZod>;
