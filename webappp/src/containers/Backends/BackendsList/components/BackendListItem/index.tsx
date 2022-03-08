import {
    Pane,
    majorScale,
    minorScale,
    Badge,
    Text,
    useTheme,
    Popover,
    Menu,
    Position,
    IconButton,
    MoreIcon,
    Tooltip,
    Spinner,
} from 'evergreen-ui';
import { useState } from 'react';
import { Backend, BackEndType } from '../../../../../requests/backends/types';

export const BackendListItem = ({
    onEdit,
    onTest,
    onDelete,
    ...backend
}: Backend & {
    onEdit: () => void;
    onDelete: () => Promise<void>;
    onTest: () => Promise<void>;
}) => {
    const theme = useTheme();
    const [isTesting, setIsTesting] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    if (backend.type === BackEndType.CLICK_UP) {
        return (
            <Pane
                key={backend._id}
                borderColor={theme.colors.blue50}
                borderRadius={theme.radii[2]}
                borderStyle="solid"
                paddingY={majorScale(1)}
                paddingX={majorScale(2)}
                flex="0 0 calc(25% - .375rem)"
                // background="tint2"
                background="white"
            >
                <Text
                    display="flex"
                    gap={minorScale(2)}
                    size="large"
                    alignItems="center"
                    background="tint2"
                    // borderBottomWidth="1px"
                    // borderBottomStyle="solid"
                    // borderBottomColor="red"
                >
                    <Badge marginRight={majorScale(1)}>Click Up</Badge>
                    {backend.name ?? 'Unnamed Backend'}
                    <Popover
                        position={Position.BOTTOM_RIGHT}
                        content={
                            <Menu>
                                <Menu.Group>
                                    <Menu.Item onSelect={onEdit}>
                                        Edit
                                    </Menu.Item>
                                    <Tooltip
                                        content="No Test"
                                        isShown={
                                            !backend.hasTestFn
                                                ? undefined
                                                : false
                                        }
                                    >
                                        <Menu.Item
                                            disabled={
                                                isTesting || !backend.hasTestFn
                                            }
                                            onSelect={async () => {
                                                setIsTesting(true);
                                                await onTest();
                                                setIsTesting(false);
                                            }}
                                        >
                                            <Pane
                                                display="flex"
                                                width="100%"
                                                alignItems="center"
                                            >
                                                {isTesting && (
                                                    <Spinner
                                                        size={majorScale(2)}
                                                        marginRight={minorScale(
                                                            1
                                                        )}
                                                    />
                                                )}
                                                <span>Test</span>
                                            </Pane>
                                        </Menu.Item>
                                    </Tooltip>
                                </Menu.Group>
                                <Menu.Divider />
                                <Menu.Group>
                                    <Menu.Item
                                        disabled={isDeleting}
                                        onSelect={async () => {
                                            setIsDeleting(true);
                                            await onDelete();
                                            setIsDeleting(false);
                                        }}
                                        intent="danger"
                                    >
                                        <Pane
                                            display="flex"
                                            width="100%"
                                            alignItems="center"
                                        >
                                            {isDeleting && (
                                                <Spinner
                                                    size={majorScale(2)}
                                                    marginRight={minorScale(1)}
                                                />
                                            )}
                                            <span>Delete</span>
                                        </Pane>
                                    </Menu.Item>
                                </Menu.Group>
                            </Menu>
                        }
                    >
                        <IconButton marginLeft="auto" icon={<MoreIcon />} />
                    </Popover>
                </Text>
                <Pane paddingTop={minorScale(1)}>
                    Last Data Update:{' '}
                    {backend.dataLastFetch
                        ? new Date(backend.dataLastFetch).toLocaleDateString(
                              'en-GB',
                              {
                                  year: 'numeric',
                                  month: 'short',
                                  day: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit',
                              }
                          )
                        : 'never'}
                </Pane>
            </Pane>
        );
    }

    return null;
};
