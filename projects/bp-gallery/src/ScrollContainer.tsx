import React, { useState } from 'react';
import './ScrollContainer.scss';

const ScrollContainer = ({ children }: { children: any }) => {
  const [scrollPos, setScrollPos] = useState<number>();
  const [scrollHeight, setScrollHeight] = useState<number>();

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
