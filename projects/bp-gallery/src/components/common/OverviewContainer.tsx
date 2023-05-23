import { IconProps, Tab, Tabs, Tooltip } from '@mui/material';
import { ReactElement, useState } from 'react';

export interface OverviewContainerTab {
  title: string;
  icon: ReactElement<IconProps>;
  content: ReactElement;
}

const OverviewContainer = ({
  tabs,
  defaultValue = 0,
}: {
  tabs: OverviewContainerTab[];
  defaultValue?: number;
}) => {
  const [tabIndex, setTabIndex] = useState<number>(defaultValue);

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
