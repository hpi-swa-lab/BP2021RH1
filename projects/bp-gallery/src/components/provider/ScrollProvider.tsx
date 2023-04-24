import { throttle } from 'lodash';
import {
  createContext,
  Dispatch,
  MutableRefObject,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { useLocation } from 'react-router-dom';
import { LocationWithState } from '../../helpers/history';

type ScrollContextProps = {
  scrollPos: number;
  setScrollPos: Dispatch<SetStateAction<number>>;
  scrollHeight: number;
  setScrollHeight: Dispatch<SetStateAction<number>>;
  scrollTo: ((scrollPos: number, smooth?: boolean) => void) | undefined;
  useWindow?: boolean;
  scrollElement: MutableRefObject<HTMLElement | null>;
};

export const ScrollProvider = ({
  children,
  useWindow,
}: PropsWithChildren<{ useWindow?: boolean }>) => {
  const [scrollPos, setScrollPos] = useState(0);
  const scrollPosRef = useRef(0);
  const [scrollHeight, setScrollHeight] = useState(0);
  const location: LocationWithState = useLocation();
  const scrollElement = useRef(useWindow ? document.documentElement : null);

  useEffect(() => {
    scrollPosRef.current = scrollPos;
  }, [scrollPos]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleScroll = useCallback(
    throttle(() => {
      setScrollPos(scrollElement.current?.scrollTop ?? 0);
      setScrollHeight(scrollElement.current?.scrollHeight ?? 0);
    }, 500),
    [setScrollHeight, setScrollPos]
  );

  const scrollTo = useCallback(
    (posY: number, smooth?: boolean) => {
      scrollElement.current?.scrollTo({ top: posY, behavior: smooth ? 'smooth' : 'auto' });
    },
    [scrollElement]
  );

  useLayoutEffect(() => {
    const pos = location.state?.scrollPos;
    if (!pos) return;

    scrollTo(pos);
    setTimeout(() => scrollTo(pos, true), 100);
  }, [location, scrollTo]);

  useEffect(() => {
    const element = useWindow ? window : scrollElement.current;
    if (!element) return;
    element.addEventListener('scroll', handleScroll);

    return () => element.removeEventListener('scroll', handleScroll);
  }, [handleScroll, useWindow]);

  return (
    <ScrollContext.Provider
      value={{
        scrollPos,
        setScrollPos,
        scrollHeight,
        setScrollHeight,
        scrollTo,
        useWindow,
        scrollElement,
      }}
    >
      <ScrollRefContext.Provider value={scrollPosRef}>{children}</ScrollRefContext.Provider>
    </ScrollContext.Provider>
  );
};

export const ScrollContext = createContext<ScrollContextProps | null>(null);

export const ScrollRefContext = createContext<MutableRefObject<number> | null>(null);
