import { z } from 'zod';

import {
    backEndMetadataZod,
    clickUpEntityBackendZod,
    entityBackendZod,
} from './BackEnd.zod';

export type ClickUpBackEndEntity = z.infer<typeof clickUpEntityBackendZod>;

export type BackEndEntity = z.infer<typeof entityBackendZod>;

export type DisplayBackEndEntity = z.infer<typeof backEndMetadataZod> &
    BackEndEntity;
