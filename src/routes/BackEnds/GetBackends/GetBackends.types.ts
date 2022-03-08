import { z } from 'zod';

export const getBackendsQueryZod = z
    .object({
        start: z
            .string()
            .regex(/^\d+$/)
            .optional()
            .transform((n) => (typeof n === 'string' ? +n : n)),
        count: z
            .string()
            .regex(/^\d+$/)
            .optional()
            .transform((n) => (typeof n === 'string' ? +n : n)),
    })
    .strip();

export type GetBackendsQuery = z.infer<typeof getBackendsQueryZod>;
