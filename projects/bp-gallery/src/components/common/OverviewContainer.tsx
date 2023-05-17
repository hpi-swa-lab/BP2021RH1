import { IconProps, Tab, Tabs, Tooltip } from '@mui/material';
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
          allowScrollButtonsMobile
          value={tabIndex}
          onChange={(_, value) => {
            setTabIndex(value as number);
          }}
        >
          {icons.map((icon, index) => (
            <Tooltip key={index} title={titles && titles.length > index ? titles[index] : ''}>
              <Tab icon={icon} />
            </Tooltip>
          ))}
        </Tabs>
      </div>
      {childrenArray[tabIndex]}
    </div>
  );
};

export default OverviewContainer;
