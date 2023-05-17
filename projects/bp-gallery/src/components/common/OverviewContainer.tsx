import { IconProps, Tab, Tabs, Tooltip } from '@mui/material';
import { ReactElement, useState } from 'react';

const OverviewContainer = ({
  tabs,
  defaultValue,
}: {
  tabs: { title: string; icon: ReactElement<IconProps>; content: ReactElement }[];
  defaultValue?: number;
}) => {
  const [tabIndex, setTabIndex] = useState<number>(defaultValue ?? 0);

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
