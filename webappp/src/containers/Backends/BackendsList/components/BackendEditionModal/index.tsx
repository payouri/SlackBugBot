import {
    Pane,
    SelectField,
    TextInputField,
    toaster,
    Dialog,
} from 'evergreen-ui';
import { useState, useMemo, useEffect } from 'react';
import { TagsInputWithLabel } from '../../../../../components/TagsInputWithLabel';
import { useRequests } from '../../../../../customHooks/useRequest';
import {
    Backend,
    BackEndType,
    Space,
    Tag,
} from '../../../../../requests/backends/types';

const ClickUpForm = ({
    values,
    onChange,
    disabled,
}: {
    values: {
        name?: string;
        type?: BackEndType;
        apiKey?: string;
        teamId?: string;
        spaceIds: string[];
        taskTags: string[];
    };
    onChange: (params: {
        name?: string;
        type?: BackEndType;
        apiKey?: string;
        teamId?: string;
        spaceIds: string[];
        taskTags: string[];
    }) => void;
    disabled: boolean;
}) => {
    const [spacesOptions, setSpacesOptions] = useState<Space[]>([]);
    const [spacesTagsOptions, setSpacesTagsOptions] = useState<Tag[]>([]);

    const getSpaces = useRequests('getSpaces');
    const getSpacesTags = useRequests('getSpacesTags');

    const allSpacesValues = spacesOptions.map(
        (space) => `${space.name}#${space.id}`
    );
    const autocompleteSpacesItems = useMemo(
        () => allSpacesValues.filter((i) => !values.spaceIds.includes(i)),
        [allSpacesValues.join(''), JSON.stringify(values)]
    );

    const allSpacesTagsValues = spacesTagsOptions.map((tag) => `${tag.name}`);
    const autocompleteSpacesTagsItems = useMemo(
        () => allSpacesTagsValues.filter((i) => !values.spaceIds.includes(i)),
        [allSpacesTagsValues.join(''), JSON.stringify(values)]
    );

    const fetchSpaces = async () => {
        if (!values.apiKey || !values.teamId) {
            setSpacesOptions([]);
            return;
        }

        const response = await getSpaces({
            query: {
                apiKey: values.apiKey || '',
                teamId: values.teamId || '',
            },
        });

        if (response.hasFailed) {
        } else {
            setSpacesOptions(response.data.spaces);
        }
    };

    const fetchSpacesTags = async () => {
        if (!values.apiKey || !values.teamId || !values.spaceIds.length) {
            setSpacesTagsOptions([]);
            return;
        }

        const response = await getSpacesTags({
            query: {
                apiKey: values.apiKey || '',
                teamId: values.teamId || '',
                spacesIds: values.spaceIds.map((s) => s.split('#').pop() || ''),
            },
        });

        if (response.hasFailed) {
        } else {
            setSpacesTagsOptions(response.data.tags);
        }
    };

    useEffect(() => {
        fetchSpaces();
    }, [values.apiKey, values.teamId]);

    useEffect(() => {
        fetchSpacesTags();
    }, [values.spaceIds.join('')]);

    return (
        <>
            <TextInputField
                label="API Key"
                description="ClickUp API Key"
                width="100%"
                value={typeof values.apiKey === 'string' ? values.apiKey : ''}
                // @ts-ignore
                onChange={(event) => {
                    onChange({
                        ...values,
                        apiKey: event.target.value,
                    });
                }}
                disabled={disabled}
            />
            <TextInputField
                label="Team Id"
                description="ClickUp Team Id"
                width="100%"
                value={typeof values.teamId === 'string' ? values.teamId : ''}
                // @ts-ignore
                onChange={(event) => {
                    onChange({
                        ...values,
                        teamId: event.target.value,
                    });
                }}
                disabled={disabled}
            />
            <TagsInputWithLabel
                label="Space IDs (optional)"
                description="Spaces to fetch tasks from"
                inputProps={{
                    placeholder: 'use Enter to separate Spaces',
                    width: '100%',
                }}
                disabled={disabled}
                values={Array.isArray(values.spaceIds) ? values.spaceIds : []}
                onAdd={(spaceIds) => {
                    const newSpaces = [...values.spaceIds, ...spaceIds];
                    if (
                        newSpaces.some(
                            (string) => !allSpacesValues.includes(string)
                        )
                    ) {
                        toaster.notify('Invalid Input');
                        return;
                    }
                    const newArray = Array.from(new Set<string>(newSpaces));
                    if (newArray.length !== newSpaces.length) {
                        const duplicate = spaceIds.pop();
                        toaster.notify('Duplicated Space Id', {
                            description: `"${duplicate}" already added`,
                            id: duplicate,
                        });
                        return;
                    }
                    onChange({
                        ...values,
                        spaceIds: newSpaces,
                    });
                }}
                onRemove={(val, index) => {
                    onChange({
                        ...values,
                        spaceIds: values.spaceIds.filter((v, i) => i !== index),
                    });
                }}
                autocompleteItems={autocompleteSpacesItems}
            />
            <TagsInputWithLabel
                label="Tags (optional)"
                description="Tags to filter relevant tasks"
                inputProps={{
                    placeholder: 'use Enter to separate Tags',
                    width: '100%',
                }}
                disabled={disabled}
                values={Array.isArray(values.taskTags) ? values.taskTags : []}
                onAdd={(taskTags) => {
                    const newTags = [...values.taskTags, ...taskTags];
                    if (
                        newTags.some(
                            (string) => !allSpacesTagsValues.includes(string)
                        )
                    ) {
                        toaster.notify('Invalid Input');
                        return;
                    }
                    const newArray = Array.from(new Set<string>(newTags));
                    if (newArray.length !== newTags.length) {
                        const duplicate = newTags.pop();
                        toaster.notify('Duplicated Space Id', {
                            description: `"${duplicate}" already added`,
                            id: duplicate,
                        });
                        return;
                    }
                    onChange({
                        ...values,
                        taskTags: newTags,
                    });
                }}
                onRemove={(val, index) => {
                    onChange({
                        ...values,
                        taskTags: values.taskTags.filter((v, i) => i !== index),
                    });
                }}
                autocompleteItems={autocompleteSpacesTagsItems}
            />
        </>
    );
};

export const BackendEditionModal = ({
    visible,
    onClose,
    onSubmit,
    loading,
    defaultData,
}: {
    visible: boolean;
    onClose: () => void;
    onSubmit: (params: {
        name?: string;
        type: BackEndType;
        apiKey: string;
        teamId: string;
        spaceIds: string[];
        taskTags: string[];
    }) => void;
    defaultData: Backend | null;
    loading: boolean;
}) => {
    const [formState, setFormState] = useState<{
        name?: string;
        type?: BackEndType;
        apiKey?: string;
        teamId?: string;
        spaceIds: string[];
        taskTags: string[];
    }>({
        taskTags: [],
        spaceIds: [],
    });

    const confirmDisabled = useMemo(() => {
        const { type, apiKey, teamId } = formState;
        return !type || !apiKey || !teamId;
    }, [JSON.stringify(formState)]);

    useEffect(() => {
        if (visible && defaultData) {
            setFormState({
                type: defaultData.type,
                name: defaultData.name,
                ...defaultData.params,
                taskTags: defaultData.params.taskTags ?? [],
                spaceIds: defaultData.params.spaceIds ?? [],
            });
        }
    }, [visible, defaultData]);

    return (
        <Dialog
            preventBodyScrolling
            title={'New Backend Form'}
            isShown={visible}
            onCancel={onClose}
            onCloseComplete={() => {
                setFormState({
                    taskTags: [],
                    spaceIds: [],
                });
                onClose();
            }}
            isConfirmDisabled={confirmDisabled}
            overlayProps={{}}
            onConfirm={() => {
                const { type, apiKey, teamId } = formState;
                if (!type || !apiKey || !teamId) return;

                onSubmit(
                    formState as {
                        name?: string;
                        type: BackEndType;
                        apiKey: string;
                        teamId: string;
                        spaceIds: string[];
                        taskTags: string[];
                    }
                );
            }}
            isConfirmLoading={loading}
        >
            <Pane
                background="white"
                minWidth="26rem"
                maxWidth="100%"
                margin="auto"
            >
                <TextInputField
                    label="Backend Name"
                    description="Display name of this backend"
                    width="100%"
                    value={formState.name}
                    // @ts-ignore
                    onChange={(event) => {
                        setFormState({
                            ...formState,
                            name: event.target.value,
                        });
                    }}
                />
                <SelectField
                    label="Backend Type"
                    description="Service from which data will be pulled"
                    width="100%"
                    value={formState.type}
                    onChange={(event) => {
                        setFormState({
                            ...formState,
                            type: event.target.value as BackEndType,
                        });
                    }}
                >
                    <option value="">Choose one</option>
                    {Object.entries(BackEndType).map(([key, value]) => (
                        <option value={value} label={key}>
                            {key}
                        </option>
                    ))}
                </SelectField>
                {formState.type === BackEndType.CLICK_UP && (
                    <ClickUpForm
                        values={formState}
                        onChange={setFormState}
                        disabled={loading}
                    />
                )}
            </Pane>
        </Dialog>
    );
};
