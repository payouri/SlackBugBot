import {
    DisplayBackEndEntity,
    BackEndEntity,
} from '../../../../src/lib/BackEnd/persistance/BackEnd.types';
import { Space, Tag } from '../../../../src/lib/clickUpClient/types';

export enum BackEndType {
    CLICK_UP = 'clickUp',
}

export type Backend = DisplayBackEndEntity;

export type IBackEnd = BackEndEntity;

export type { Space, Tag };
