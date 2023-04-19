import {
  createContext,
  Dispatch,
  MutableRefObject,
  PropsWithChildren,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';

type ScrollContextProps = {
  scrollPos: number;
  setScrollPos: Dispatch<SetStateAction<number>>;
  scrollHeight: number;
  setScrollHeight: Dispatch<SetStateAction<number>>;
  scrollTo: ((scrollPos: number, smooth?: boolean) => void) | undefined;
  setScrollTo: Dispatch<SetStateAction<((scrollPos: number) => void) | undefined>>;
};

export const ScrollProvider = ({ children }: PropsWithChildren<{}>) => {
  const [scrollPos, setScrollPos] = useState(0);
  const scrollPosRef = useRef(0);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [scrollTo, setScrollTo] = useState<(posY: number, smooth?: boolean) => void>();

  useEffect(() => {
    scrollPosRef.current = scrollPos;
  }, [scrollPos]);

  return (
    <ScrollContext.Provider
      value={{ scrollPos, setScrollPos, scrollHeight, setScrollHeight, scrollTo, setScrollTo }}
    >
      <ScrollRefContext.Provider value={scrollPosRef}>{children}</ScrollRefContext.Provider>
    </ScrollContext.Provider>
  );
};

export const ScrollContext = createContext<ScrollContextProps | null>(null);

export const ScrollRefContext = createContext<MutableRefObject<number> | null>(null);
