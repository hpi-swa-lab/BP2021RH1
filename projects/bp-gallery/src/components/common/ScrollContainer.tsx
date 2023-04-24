import { PropsWithChildren, useEffect, useRef } from 'react';
import { useMobile, useScroll } from './../../hooks/context-hooks';

const ScrollContainer = ({ children }: PropsWithChildren<{}>) => {
  const divRef = useRef<HTMLDivElement>(null);
  const { useWindow, elementRef: scrollElement } = useScroll();
  const { isMobile } = useMobile();

  useEffect(() => {
    if (useWindow && isMobile) return;
    scrollElement.current = divRef.current;
  }, [isMobile, scrollElement, useWindow]);

  return (
    <div ref={divRef} className='scrollable-container'>
      {children}
    </div>
  );
};
export default ScrollContainer;
