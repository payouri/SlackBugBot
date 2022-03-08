import { ClickUpBackendType, createClickUpBackend } from '../ClickUpBackend';
import { BackEndType } from '../constants';
import {
    BackEndEntity,
    ClickUpBackEndEntity,
} from '../persistance/BackEnd.types';

export const isClickUpEntityBackend = (
    backend: BackEndEntity
): backend is ClickUpBackEndEntity => backend.type === BackEndType.CLICK_UP;

export const createBackendInstance = (
    backend: BackEndEntity
): ClickUpBackendType => {
    if (isClickUpEntityBackend(backend)) return createClickUpBackend(backend);
    throw new TypeError(
        `Unrecognized Backend Type: ${JSON.stringify(backend)}`
    );
};

export const getObfuscatedApiKey = (s: string) =>
    `${s.slice(0, 6)}${Array.from({ length: 10 }, () => '*').join('')}${s.slice(
        s.length - 3
    )}`;

export const formatBackendForDisplay = (
    backend: BackEndEntity
): BackEndEntity => {
    if (isClickUpEntityBackend(backend))
        return {
            ...backend,
            params: {
                ...backend.params,
            },
        };

    return backend;
};
