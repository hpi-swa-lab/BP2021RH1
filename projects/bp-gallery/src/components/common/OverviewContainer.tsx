import { IconProps, Tab, Tabs, Tooltip } from '@mui/material';
import { ReactElement, useCallback, useMemo } from 'react';
import { useMobile } from '../../hooks/context-hooks';
import useStorageState from '../../hooks/storage-state.hook';

export interface OverviewContainerTab {
  title: string;
  icon: ReactElement<IconProps>;
  content: ReactElement;
}

export enum OverviewContainerPosition {
  START_VIEW = 'start',
  DISCOVER_VIEW = 'discover',
  ARCHIVE_VIEW = 'archives',
}

type SelectedTabsData = {
  start?: number;
  discover?: { [tabID: string]: number | undefined };
  archives?: { [archiveID: string]: number | undefined };
};

const OverviewContainer = ({
  tabs,
  defaultTabIndex = 0,
  overviewPosition,
  tabID,
}: {
  tabs: OverviewContainerTab[];
  defaultTabIndex?: number;
  overviewPosition: OverviewContainerPosition;
  tabID?: string;
}) => {
  const { isMobile } = useMobile();
  const [selectedTabs, setSelectedTabs] = useStorageState<SelectedTabsData>(
    { start: undefined, discover: undefined, archives: undefined },
    'selected_tabs',
    localStorage
  );

  const tabIndex = useMemo(() => {
    const temporaryTabIndex =
      overviewPosition !== OverviewContainerPosition.START_VIEW
        ? tabID
          ? (selectedTabs[overviewPosition] ?? { [tabID]: defaultTabIndex })[tabID] ??
            defaultTabIndex
          : defaultTabIndex
        : selectedTabs[overviewPosition] ?? defaultTabIndex;
    return 0 <= temporaryTabIndex && temporaryTabIndex < tabs.length
      ? temporaryTabIndex
      : defaultTabIndex;
  }, [overviewPosition, tabID, selectedTabs, defaultTabIndex, tabs.length]);

  const setTabIndex = useCallback(
    (tabIndex: number) => {
      if (overviewPosition === OverviewContainerPosition.START_VIEW) {
        setSelectedTabs(selectedTabs => ({ ...selectedTabs, [overviewPosition]: tabIndex }));
        return;
      }
      if (tabID) {
        setSelectedTabs(selectedTabs => ({
          ...selectedTabs,
          [overviewPosition]: {
            ...selectedTabs[overviewPosition],
            [tabID]: tabIndex,
          },
        }));
      }
    },
    [overviewPosition, tabID, setSelectedTabs]
  );

  return (
    <div className='overview-selection-container'>
      <div className='overview-selection-header'>
        <h2 className='overview-selection-title'>{tabs[tabIndex].title}</h2>
        <Tabs
          variant='scrollable'
          allowScrollButtonsMobile
          value={tabIndex}
          onChange={(_, value) => {
            setTabIndex(value as number);
          }}
        >
          {tabs.map((tab, index) => (
            <Tooltip key={index} title={tab.title}>
              {isMobile ? <Tab icon={tab.icon} /> : <Tab label={tab.title} />}
            </Tooltip>
          ))}
        </Tabs>
      </div>
      {tabs[tabIndex].content}
    </div>
  );
};

export default OverviewContainer;
