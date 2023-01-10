import React, { ReactComponentElement, useEffect, useRef, useState } from 'react';
import './ScrollContainer.scss';
import { useHistory } from 'react-router-dom';
import { History } from 'history';

const ScrollContainer = ({
  children,
  scrollTop,
}: {
  children: (scrollPos: number, scrollHeight: number) => ReactComponentElement<any>;
  scrollTop?: boolean;
}) => {
  const [scrollPos, setScrollPos] = useState<number>(0);
  const [scrollHeight, setScrollHeight] = useState<number>(0);
  const scrollDiv = useRef<HTMLDivElement>(null);
  const history: History = useHistory();

  //neccessary so that container scrolls to top when pressing on top bar logo on startpage
  useEffect(() => {
    if (scrollTop && history.location.state?.scrollTop) {
      scrollDiv.current?.scrollTo(0, 0);
      history.replace('', { showBack: false, scrollTop: false });
    }
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  }, [scrollTop, history, history?.location?.state]);

  return (
    <div className='scroll-context'>
      <div
        ref={scrollDiv}
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
