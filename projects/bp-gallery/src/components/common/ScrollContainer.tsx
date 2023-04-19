import { throttle } from 'lodash';
import { PropsWithChildren, useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { useVisit } from './../../helpers/history';
import { useScroll } from './../../hooks/context-hooks';
import './ScrollContainer.scss';

const ScrollContainer = ({ children }: PropsWithChildren<{}>) => {
  const { location } = useVisit();
  const divRef = useRef<HTMLDivElement>(null);
  const { setScrollPos, setScrollHeight, setScrollTo } = useScroll();

  const scrollTo = useCallback((posY: number, smooth?: boolean) => {
    divRef.current?.scrollTo({ top: posY, behavior: smooth ? 'smooth' : 'auto' });
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleScroll = useCallback(
    throttle((event: React.UIEvent) => {
      const element = event.target as HTMLElement;
      setScrollPos(element.scrollTop);
      setScrollHeight(element.scrollHeight);
    }, 100),
    [setScrollHeight, setScrollPos]
  );

  useEffect(() => {
    setScrollTo(() => scrollTo);
  }, [scrollTo, setScrollTo]);

  useLayoutEffect(() => {
    const pos = location.state?.scrollPos;
    if (!pos) return;

    scrollTo(pos);
    setTimeout(() => scrollTo(pos, true), 100);
  }, [location, scrollTo]);

  return (
    <div ref={divRef} className='scrollable-container' onScroll={handleScroll}>
      {children}
    </div>
  );
};
export default ScrollContainer;
