import { IconProps, Tab, Tabs, Tooltip } from '@mui/material';
import { ReactElement, useCallback, useContext, useMemo } from 'react';
import useStorageState from '../../hooks/storage-state.hook';
import { MobileContext } from '../provider/MobileProvider';

export interface OverviewContainerTab {
  title: string;
  icon: ReactElement<IconProps>;
  desktopText?: string;
  content: ReactElement;
}

export enum OverviewContainerPosition {
  START_VIEW = 'start',
  DISCOVER_VIEW = 'discover',
  ARCHIVE_VIEW = 'archives',
}

type SelectedTabsData = {
  start?: number;
  discover?: number;
  archives?: { [archiveID: string]: number | undefined };
};

const OverviewContainer = ({
  tabs,
  defaultTabIndex = 0,
  overviewPosition,
  archiveID,
}: {
  tabs: OverviewContainerTab[];
  defaultTabIndex?: number;
  overviewPosition: OverviewContainerPosition;
  archiveID?: string;
}) => {
  const { isMobile } = useContext(MobileContext);
  const [selectedTabs, setSelectedTabs] = useStorageState<SelectedTabsData>(
    { start: undefined, discover: undefined, archives: undefined },
    'selected_tabs',
    localStorage
  );

  const tabIndex = useMemo(
    () =>
      overviewPosition === OverviewContainerPosition.ARCHIVE_VIEW
        ? archiveID
          ? (selectedTabs[overviewPosition] ?? { [archiveID]: defaultTabIndex })[archiveID] ??
            defaultTabIndex
          : defaultTabIndex
        : selectedTabs[overviewPosition] ?? defaultTabIndex,
    [overviewPosition, archiveID, selectedTabs, defaultTabIndex]
  );

  const setTabIndex = useCallback(
    (tabIndex: number) => {
      if (overviewPosition !== OverviewContainerPosition.ARCHIVE_VIEW) {
        setSelectedTabs(selectedTabs => ({ ...selectedTabs, [overviewPosition]: tabIndex }));
        return;
      }
      if (archiveID) {
        setSelectedTabs(selectedTabs => ({
          ...selectedTabs,
          [overviewPosition]: {
            ...selectedTabs[overviewPosition],
            [archiveID]: tabIndex,
          },
        }));
      }
    },
    [overviewPosition, archiveID, setSelectedTabs]
  );

  return (
    <div className='overview-selection-container'>
      <div className='overview-selection-header'>
        <h2 className='overview-selection-title'>{tabs[tabIndex].title}</h2>
        <Tabs
          variant='scrollable'
          value={tabIndex}
          onChange={(_, value) => {
            setTabIndex(value as number);
          }}
        >
          {tabs.map((tab, index) => (
            <Tooltip key={index} title={tab.title}>
              <Tab icon={isMobile ? tab.icon : tab.desktopText ?? tab.title} />
            </Tooltip>
          ))}
        </Tabs>
      </div>
      {tabs[tabIndex].content}
    </div>
  );
};

export default OverviewContainer;
