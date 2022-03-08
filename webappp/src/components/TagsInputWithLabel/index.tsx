import {
    majorScale,
    minorScale,
    Pane,
    TagInput,
    Text,
    useTheme,
    TagInputProps,
    PaneProps,
} from 'evergreen-ui';

export const TagsInputWithLabel = ({
    label,
    description,
    wrapperProps,
    ...props
}: TagInputProps & {
    label?: string;
    description?: string;
    wrapperProps?: PaneProps;
}) => {
    const theme = useTheme();

    return (
        <Pane marginBottom={majorScale(3)} {...wrapperProps}>
            {(label || description) && (
                <Pane
                    display="flex"
                    flexDirection="column"
                    marginBottom={minorScale(2)}
                >
                    {label && (
                        <Text
                            lineHeight={theme.lineHeights[0]}
                            color={theme.colors.dark}
                        >
                            {label}
                        </Text>
                    )}
                    {description && (
                        <Text
                            marginTop={minorScale(1)}
                            size="small"
                            lineHeight={theme.lineHeights[1]}
                            color={theme.colors.muted}
                        >
                            {description}
                        </Text>
                    )}
                </Pane>
            )}
            <TagInput width="100%" {...props} />
        </Pane>
    );
};
