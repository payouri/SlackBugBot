import { majorScale, Pane, Spinner, useTheme, SearchInput } from 'evergreen-ui';
import { useEffect, useRef } from 'react';
import { useBoundingClientRect } from '../../../customHooks/useBoundingClientRect';
import { useKnowledgeBase } from '../../../customHooks/useKnowledgeBase';
import { useScroll } from '../../../customHooks/useScroll';
import { KnowledgeBaseEntryListItem } from './components/KnowledgeBaseEntryListItem';

export const KnowledgeBaseList = () => {
    const theme = useTheme();
    const { loading, entries, loadMore, setSearch, search } =
        useKnowledgeBase();
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const [scrollState] = useScroll({
        getScrollTarget: () => scrollAreaRef,
        scrollOptions: {},
    });
    const [boundingRectState] = useBoundingClientRect({
        getTarget: () => scrollAreaRef,
    });

    useEffect(() => {
        if (
            scrollState === null ||
            boundingRectState === null ||
            scrollState.scrollTop === 0 ||
            boundingRectState.height === 0
        )
            return;

        if (
            scrollState.scrollHeight -
                (boundingRectState.height + scrollState.scrollTop) <
            100
        ) {
            loadMore();
        }
    }, [
        scrollState?.scrollTop,
        scrollState?.scrollHeight,
        boundingRectState?.height,
    ]);

    return (
        <Pane
            display="flex"
            flex="1 1 auto"
            minHeight={0}
            paddingX={majorScale(3)}
            paddingY={majorScale(2)}
            gap={majorScale(2)}
            maxWidth="100%"
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
                <SearchInput
                    width="100%"
                    // @ts-ignore
                    onChange={(event) => {
                        setSearch(event.target.value);
                    }}
                    value={search}
                    placeholder="Search Knowledge Entries"
                />
            </Pane>
            <Pane
                ref={scrollAreaRef}
                background="tint1"
                flex="1 1 100%"
                minWidth={0}
                height="100%"
                maxHeight="100%"
                minHeight="100%"
                maxWidth="calc(100% - 20.5rem)"
                alignContent={
                    loading && !entries.length ? undefined : 'flex-start'
                }
                alignItems={
                    loading && !entries.length ? 'center' : 'flex-start'
                }
                justifyContent={
                    loading && !entries.length ? 'center' : 'flex-start'
                }
                display="grid"
                padding={majorScale(1)}
                gap={majorScale(1)}
                overflowY="auto"
                gridTemplateColumns="1fr"
                gridAutoRows="max-content"
            >
                {loading && !entries.length ? (
                    <Spinner delay={125} />
                ) : (
                    [
                        ...entries.map((entry) => (
                            <KnowledgeBaseEntryListItem
                                key={entry._id}
                                {...entry}
                                onEdit={() => {}}
                                onDelete={async () => {}}
                            />
                        )),
                        loading && (
                            <Pane
                                key={'loader'}
                                borderColor={theme.colors.blue50}
                                borderRadius={theme.radii[2]}
                                borderStyle="solid"
                                paddingY={majorScale(1)}
                                paddingX={majorScale(2)}
                                // background="tint2"
                                background="white"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Spinner />
                            </Pane>
                        ),
                    ]
                )}
            </Pane>
        </Pane>
    );
};
