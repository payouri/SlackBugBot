import { Model, model, Schema } from 'mongoose';
import { NODE_ENV } from '../../../config';
import { BackEndType } from '../../BackEnd/constants';
import { KnowledgeBaseEntityType } from './KnowledgeBase.types';

const KnowledgeBaseSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            default: '',
        },
        body: {
            type: String,
            required: true,
            default: '',
        },
        source: {
            type: String,
            enum: Object.values(BackEndType),
            required: true,
        },
        metadata: {},
    },
    {
        minimize: false,
        timestamps: true,
        autoIndex: NODE_ENV !== 'test',
    }
);

KnowledgeBaseSchema.index({
    body: 'text',
    title: 'text',
});

KnowledgeBaseSchema.index(
    {
        'metadata.id': 1,
    },
    {
        unique: true,
    }
);

KnowledgeBaseSchema.index(
    {
        source: 1,
        'metadata.id': 1,
        'metadata.status': 1,
    },
    {
        sparse: true,
    }
);

let knowledgeBaseModel: Model<KnowledgeBaseEntityType>;

export const getKnowledgeBaseModel = (): Model<KnowledgeBaseEntityType> => {
    if (!knowledgeBaseModel) {
        knowledgeBaseModel = model('KnowledgeBases', KnowledgeBaseSchema);
    }

    return knowledgeBaseModel;
};
