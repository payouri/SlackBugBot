import { Model, model, Schema } from 'mongoose';
import { ClickUpBackendModelParams } from '../ClickUpBackend/ClickUpBackend.model';
import { BackEndType } from '../constants';
import { BackEndEntity } from './BackEnd.types';

const BackEndSchema = new Schema(
    {
        name: {
            type: String,
            required: false,
            default: 'Unnamed Backend',
        },
        type: {
            type: String,
            enum: Object.values(BackEndType),
            required: true,
        },
        dataLastFetch: {
            type: String,
            required: false,
        },
        params: {
            ...ClickUpBackendModelParams,
        },
        metadata: {
            currentlyProcessing: {
                type: Boolean,
            },
            processingLockedUntil: {
                type: String,
            },
        },
    },
    {
        minimize: false,
    }
);

let backEndModel: Model<BackEndEntity>;

export const getBackEndModel = (): Model<BackEndEntity> => {
    if (!backEndModel) {
        backEndModel = model('Backends', BackEndSchema);
    }

    return backEndModel;
};
