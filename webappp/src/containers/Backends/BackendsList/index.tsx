import {
    Pane,
    majorScale,
    Spinner,
    Button,
    PlusIcon,
    toaster,
} from 'evergreen-ui';
import { useEffect, useState } from 'react';
import { useBackends } from '../../../customHooks/useBackends';
import { useRequests } from '../../../customHooks/useRequest';
import { Backend, BackEndType } from '../../../requests/backends/types';
import { BackendEditionModal } from './components/BackendEditionModal';
import { BackendListItem } from './components/BackendListItem';

export const BackendsList = () => {
    const { loading, backends, push, updateOne, deleteOne } = useBackends();
    const [editedBackend, setEditedBackend] = useState<Backend | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [loadingCreate, setLoadingCreate] = useState<boolean>(false);
    const createBackend = useRequests('createBackend');
    const updateBackend = useRequests('updateBackend');
    const testBackend = useRequests('testBackend');
    const deleteBackend = useRequests('deleteBackend');

    const handleCreateBackend = async ({
        type,
        name,
        apiKey,
        teamId,
        spaceIds,
        taskTags,
    }: {
        name?: string;
        type: BackEndType;
        apiKey: string;
        teamId: string;
        spaceIds: string[];
        taskTags: string[];
    }) => {
        if (loadingCreate) return;
        setLoadingCreate(true);

        const response = await createBackend({
            body: {
                type,
                name,
                params: {
                    apiKey,
                    teamId,
                    spaceIds,
                    taskTags,
                },
            },
        });

        if (response.hasFailed) {
            toaster.danger('Failed to create Backend', {
                description: response.error,
            });
        } else {
            push([response.data.backend]);
            setIsEditing(false);
        }

        setLoadingCreate(false);
    };

    const handleUpdateBackend = async ({
        _id,
        type,
        name,
        apiKey,
        teamId,
        spaceIds,
        taskTags,
    }: {
        _id: string;
        name?: string;
        type: BackEndType;
        apiKey: string;
        teamId: string;
        spaceIds: string[];
        taskTags: string[];
    }) => {
        if (loadingCreate) return;
        setLoadingCreate(true);

        const response = await updateBackend({
            params: {
                backendId: _id,
                type,
            },
            body: {
                name,
                apiKey,
                teamId,
                spaceIds,
                taskTags,
            },
        });

        if (response.hasFailed) {
            toaster.danger('Failed to update Backend', {
                description: response.error,
            });
        } else {
            updateOne(response.data.backend);
            setIsEditing(false);
        }

        setLoadingCreate(false);
    };

    const handleTestBackend = async (id: string) => {
        const response = await testBackend({
            params: {
                backendId: id,
            },
        });
        if (response.hasFailed || response.data.hasFailed === true) {
            toaster.danger('Backend test failed', {
                description:
                    !response.hasFailed && response.data.hasFailed
                        ? response.data.message
                        : undefined,
                id: `test_failed_${id}`,
            });
        } else {
            toaster.success('Backend test success', {
                id: `test_success_${id}`,
            });
        }
    };

    const handleDeleteBackend = async (id: string) => {
        const response = await deleteBackend({
            params: {
                backendId: id,
            },
        });
        if (response.hasFailed) {
            toaster.danger('Backend delete failed', {
                id: `delete_failed_${id}`,
            });
        } else {
            toaster.success('Backend deleted', {
                id: `delete_success_${id}`,
            });
            deleteOne(id);
        }
    };

    useEffect(() => {
        if (!isEditing && !editedBackend) {
            setEditedBackend(null);
        }
    }, [isEditing]);

    return (
        <>
            <BackendEditionModal
                visible={isEditing}
                onClose={() => {
                    if (isEditing) setIsEditing(false);
                }}
                onSubmit={(data) =>
                    !editedBackend
                        ? handleCreateBackend(data)
                        : handleUpdateBackend({
                              ...data,
                              _id: editedBackend._id,
                          })
                }
                loading={loadingCreate}
                defaultData={editedBackend}
            />
            <Pane
                display="flex"
                flex="1 1 auto"
                paddingX={majorScale(3)}
                paddingY={majorScale(2)}
                gap={majorScale(2)}
            >
                <Pane
                    flex="0 0 20rem"
                    height="100%"
                    maxHeight="100%"
                    minHeight="100%"
                    display="flex"
                    flexFlow="column nowrap"
                    padding={majorScale(1)}
                    background="tint1"
                >
                    <Button
                        iconBefore={<PlusIcon />}
                        alignSelf="flex-end"
                        size="large"
                        justifySelf="end"
                        onClick={() => {
                            if (!isEditing) setIsEditing(true);
                        }}
                        isLoading={loadingCreate}
                    >
                        Add Backend
                    </Button>
                </Pane>
                <Pane
                    background="tint1"
                    flex="1 1 100%"
                    height="100%"
                    maxHeight="100%"
                    minHeight="100%"
                    alignContent={loading ? undefined : 'flex-start'}
                    alignItems={loading ? 'center' : 'flex-start'}
                    justifyContent={loading ? 'center' : 'flex-start'}
                    display="flex"
                    flexWrap="wrap"
                    padding={majorScale(1)}
                    gap={majorScale(1)}
                    overflowY="auto"
                >
                    {loading && !backends.length ? (
                        <Spinner delay={125} />
                    ) : (
                        backends.map((backend) => (
                            <BackendListItem
                                key={backend._id}
                                {...backend}
                                onEdit={() => {
                                    setEditedBackend(backend);
                                    setIsEditing(true);
                                }}
                                onDelete={async () => {
                                    await handleDeleteBackend(backend._id);
                                }}
                                onTest={async () => {
                                    await handleTestBackend(backend._id);
                                }}
                            />
                        ))
                    )}
                </Pane>
            </Pane>
        </>
    );
};
