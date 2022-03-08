import { majorScale, Pane, Tab, Tablist } from 'evergreen-ui';
import { useState } from 'react';
import { BackendsList } from '../Backends/BackendsList';
import { KnowledgeBaseList } from '../KnowledgeBase/KnowledgeBaseList';

const TABS = ['Backends', 'KnowledgeBase'] as const;

export const LoggedApp = () => {
    const [currentTab, setCurrentTab] = useState<typeof TABS[number]>(TABS[0]);

    return (
        <Pane
            height="100%"
            display="flex"
            flexDirection="column"
            maxWidth="100%"
        >
            <Pane
                background="tint1"
                paddingY={majorScale(2)}
                paddingRight={majorScale(1)}
                paddingLeft={majorScale(1)}
                marginRight={majorScale(2)}
                marginLeft={majorScale(2)}
                position="sticky"
                top={majorScale(0)}
            >
                <Tablist>
                    {TABS.map((tab) => (
                        <Tab
                            key={tab}
                            id={tab}
                            onSelect={() => {
                                if (tab !== currentTab) setCurrentTab(tab);
                            }}
                            isSelected={tab === currentTab}
                            aria-controls={`panel-${tab}`}
                        >
                            {tab}
                        </Tab>
                    ))}
                </Tablist>
            </Pane>
            {currentTab === 'Backends' && <BackendsList />}
            {currentTab === 'KnowledgeBase' && <KnowledgeBaseList />}
        </Pane>
    );
};
