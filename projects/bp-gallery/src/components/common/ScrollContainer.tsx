import React, { ReactComponentElement, useState } from 'react';
import './ScrollContainer.scss';

const ScrollContainer = ({
  children,
}: {
  children: (scrollPos: number, scrollHeight: number) => ReactComponentElement<any>;
}) => {
  const [scrollPos, setScrollPos] = useState<number>(0);
  const [scrollHeight, setScrollHeight] = useState<number>(0);

  return (
    <div className='scroll-context'>
      <div
        className='scrollable-container'
        onScroll={event => {
          setScrollPos((event.target as HTMLElement).scrollTop);
          setScrollHeight((event.target as HTMLElement).scrollHeight);
        }}
      >
        {children(scrollPos, scrollHeight)}
      </div>
    </div>
  );
};
export default ScrollContainer;
