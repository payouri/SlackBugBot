export const ClickUpBackendModelParams = {
    apiKey: {
        type: String,
        required: true,
    },
    teamId: {
        type: String,
        required: true,
    },
    spaceIds: {
        type: [String],
        required: true,
        default: [],
    },
    taskTags: {
        type: [String],
        required: true,
        default: [],
    },
};
