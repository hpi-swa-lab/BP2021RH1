import { IconProps, Tab, Tabs } from '@mui/material';
import { Children, PropsWithChildren, ReactElement, useState } from 'react';

const OverviewContainer = ({
  titles,
  icons,
  children,
}: PropsWithChildren<{ titles?: string[]; icons: ReactElement<IconProps>[] }>) => {
  const childrenArray = Children.toArray(children);
  const [tabIndex, setTabIndex] = useState<number>(0);

  return (
    <div className='overview-selection-container'>
      <div className='overview-selection-header'>
        {titles && <h2 className='overview-selection-title'>{titles[tabIndex]}</h2>}
        <Tabs
          variant='scrollable'
          value={tabIndex}
          onChange={(_, value) => {
            setTabIndex(value as number);
          }}
        >
          {icons.map((icon, index) => (
            <Tab icon={icon} key={index} />
          ))}
        </Tabs>
      </div>
      {childrenArray[tabIndex]}
    </div>
  );
};

export default OverviewContainer;
