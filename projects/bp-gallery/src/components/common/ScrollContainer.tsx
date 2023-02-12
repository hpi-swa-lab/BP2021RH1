import { useState } from 'react';
import './ScrollContainer.scss';

const ScrollContainer = ({
  children,
}: {
  children: ((scrollPos: number, scrollHeight: number) => React.ReactNode) | React.ReactNode;
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
        {typeof children === 'function' ? children(scrollPos, scrollHeight) : children}
      </div>
    </div>
  );
};
export default ScrollContainer;
