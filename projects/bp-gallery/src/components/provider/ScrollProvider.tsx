import { throttle } from 'lodash';
import {
  createContext,
  MutableRefObject,
  PropsWithChildren,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { useLocation } from 'react-router-dom';
import { LocationWithState } from '../../helpers/history';
import { useMobile } from '../../hooks/context-hooks';

type ScrollContextProps = {
  scrollPos: number;
  scrollHeight: number;
  scrollTo: ((scrollPos: number, smooth?: boolean) => void) | undefined;
  useWindow?: boolean;
  elementRef: MutableRefObject<HTMLElement | null>;
};

export const ScrollProvider = ({
  children,
  useWindow,
}: PropsWithChildren<{ useWindow?: boolean }>) => {
  const [scrollPos, setScrollPos] = useState(0);
  const scrollPosRef = useRef(0);
  const [scrollHeight, setScrollHeight] = useState(0);
  const location: LocationWithState = useLocation();
  const { isMobile } = useMobile();
  const elementRef = useRef(useWindow && isMobile ? document.documentElement : null);

  useEffect(() => {
    scrollPosRef.current = scrollPos;
  }, [scrollPos]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleScroll = useCallback(
    throttle(() => {
      setScrollPos(elementRef.current?.scrollTop ?? 0);
      setScrollHeight(elementRef.current?.scrollHeight ?? 0);
    }, 500),
    [setScrollHeight, setScrollPos]
  );

  const scrollTo = useCallback(
    (posY: number, smooth?: boolean) => {
      elementRef.current?.scrollTo({ top: posY, behavior: smooth ? 'smooth' : 'auto' });
    },
    [elementRef]
  );

  useLayoutEffect(() => {
    const pos = location.state?.scrollPos;
    if (!pos) return;

    scrollTo(pos);
    setTimeout(() => scrollTo(pos, true), 100);
  }, [location, scrollTo]);

  useEffect(() => {
    const element = useWindow && isMobile ? window : elementRef.current;
    if (!element) return;
    element.addEventListener('scroll', handleScroll);

    return () => element.removeEventListener('scroll', handleScroll);
  }, [handleScroll, isMobile, useWindow]);

  return (
    <ScrollContext.Provider
      value={{
        scrollPos,
        scrollHeight,
        scrollTo,
        useWindow,
        elementRef,
      }}
    >
      <ScrollRefContext.Provider value={scrollPosRef}>{children}</ScrollRefContext.Provider>
    </ScrollContext.Provider>
  );
};

export const ScrollContext = createContext<ScrollContextProps | null>(null);

//exists to avoid constant rerenders on components that only need the scroll position on e.g. click
export const ScrollRefContext = createContext<MutableRefObject<number> | null>(null);
