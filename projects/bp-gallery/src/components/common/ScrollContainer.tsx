import { PropsWithChildren, useEffect, useRef } from 'react';
import { useScroll } from './../../hooks/context-hooks';

const ScrollContainer = ({ children }: PropsWithChildren<{}>) => {
  const divRef = useRef<HTMLDivElement>(null);
  const { useWindow, scrollElement } = useScroll();

  // eslint-disable-next-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (useWindow) return;
    scrollElement.current = divRef.current;
  }, [scrollElement, useWindow]);

  return (
    <div ref={divRef} className='scrollable-container'>
      {children}
    </div>
  );
};
export default ScrollContainer;
