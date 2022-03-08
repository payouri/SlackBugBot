import {
    Badge,
    IconButton,
    majorScale,
    Menu,
    minorScale,
    MoreIcon,
    Pane,
    Popover,
    Position,
    Spinner,
    Text,
    useTheme,
} from 'evergreen-ui';
import { useState } from 'react';
import { BackendTypeDisplayName } from '../../../../../constants';
import { IKnowledgeBaseEntry } from '../../../../../requests/knowledgeBase/types';

export const KnowledgeBaseEntryListItem = ({
    onEdit,
    onDelete,
    ...entry
}: IKnowledgeBaseEntry & {
    onEdit: () => void;
    onDelete: () => Promise<void>;
}) => {
    const theme = useTheme();
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    return (
        <Pane
            key={entry._id}
            borderColor={theme.colors.blue50}
            borderRadius={theme.radii[2]}
            borderStyle="solid"
            paddingY={majorScale(1)}
            paddingX={majorScale(2)}
            // background="tint2"
            background="white"
            minWidth={0}
            overflowX="hidden"
        >
            <Text
                display="flex"
                gap={minorScale(2)}
                size="large"
                alignItems="center"
                background="tint2"
                textOverflow="hidden"
                // borderBottomWidth="1px"
                // borderBottomStyle="solid"
                // borderBottomColor="red"
            >
                <Badge marginRight={majorScale(1)} flex="0 0 auto">
                    {BackendTypeDisplayName[entry.source]}
                </Badge>
                {entry.title ?? 'Unnamed entry'}
                <Popover
                    position={Position.BOTTOM_RIGHT}
                    content={
                        <Menu>
                            <Menu.Group>
                                <Menu.Item onSelect={onEdit}>Edit</Menu.Item>
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
            <Text
                whiteSpace="pre-wrap"
                maxWidth="100%"
                minWidth={0}
                textOverflow="ellipsis"
            >
                {(entry.body || 'No Description').replace(/_/g, '')}
            </Text>
        </Pane>
    );
};
