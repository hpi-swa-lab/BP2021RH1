import { IconProps, Tab, Tabs, Tooltip } from '@mui/material';
import { ReactElement, useEffect, useState } from 'react';
import { useStorage } from '../../hooks/context-hooks';

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

const OverviewContainer = ({
  tabs,
  defaultValue = 0,
  overviewPosition,
  archiveID,
}: {
  tabs: OverviewContainerTab[];
  defaultValue?: number;
  overviewPosition: OverviewContainerPosition;
  archiveID?: string;
}) => {
  const [selectedTabs, setSelectedTabs] = useStorage().selectedTabsState;
  const [tabIndex, setTabIndex] = useState<number>(0);

  useEffect(() => {
    setTabIndex(
      overviewPosition === OverviewContainerPosition.ARCHIVE_VIEW
        ? archiveID
          ? (selectedTabs[overviewPosition] ?? { [archiveID]: defaultValue })[archiveID] ??
            defaultValue
          : defaultValue
        : selectedTabs[overviewPosition] ?? defaultValue
    );
  }, [overviewPosition, archiveID, selectedTabs, defaultValue]);

  return (
    <div className='overview-selection-container'>
      <div className='overview-selection-header'>
        <h2 className='overview-selection-title'>{tabs[tabIndex].title}</h2>
        <Tabs
          variant='scrollable'
          allowScrollButtonsMobile
          value={tabIndex}
          onChange={(_, value) => {
            if (overviewPosition === OverviewContainerPosition.ARCHIVE_VIEW) {
              if (archiveID) {
                setSelectedTabs({
                  ...selectedTabs,
                  [overviewPosition]: {
                    ...selectedTabs[overviewPosition],
                    [archiveID]: value as number,
                  },
                });
              }
            } else {
              setSelectedTabs({ ...selectedTabs, [overviewPosition]: value as number });
            }
            setTabIndex(value as number);
          }}
        >
          {tabs.map((tab, index) => (
            <Tooltip key={index} title={tab.title}>
              <Tab icon={tab.icon} />
            </Tooltip>
          ))}
        </Tabs>
      </div>
      {tabs[tabIndex].content}
    </div>
  );
};

export default OverviewContainer;
