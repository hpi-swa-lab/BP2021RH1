import { Location } from 'history';
import { PropsWithChildren, useCallback, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import scrollPoss from '../../helpers/scrollPos';
import { useScroll } from './../../hooks/scrolll-hook';
import './ScrollContainer.scss';

const ScrollContainer = ({ children }: PropsWithChildren<{}>) => {
  const { pathname }: Location = useLocation();
  const divRef = useRef<HTMLDivElement>(null);
  const { setScrollPos, setScrollHeight, setScrollTo, scrollPos } = useScroll();

  const scrollTo = useCallback((posY: number, smooth?: boolean) => {
    divRef.current?.scrollTo({ top: posY, behavior: smooth ? 'smooth' : 'auto' });
  }, []);

  console.log(scrollPos);

  useEffect(() => {
    setScrollTo(() => scrollTo);
  }, [scrollTo, setScrollTo]);

  return (
    <div
      ref={divRef}
      className='scrollable-container'
      onScroll={event => {
        const element = event.target as HTMLElement;
        setScrollPos(element.scrollTop);
        setScrollHeight(element.scrollHeight);
        scrollPoss.set(pathname, element.scrollTop);
      }}
    >
      {children}
    </div>
  );
};
export default ScrollContainer;
