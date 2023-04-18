import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
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

export const useScroll = () => {
  const value = useContext(ScrollContext);
  if (!value) {
    throw new Error('missing clipboard context');
  }
  return value;
};

export const ScrollProvider = ({ children }: PropsWithChildren<{}>) => {
  const [scrollPos, setScrollPos] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [scrollTo, setScrollTo] = useState<(posY: number, smooth?: boolean) => void>();

  return (
    <ScrollContext.Provider
      value={{ scrollPos, setScrollPos, scrollHeight, setScrollHeight, scrollTo, setScrollTo }}
    >
      {children}
    </ScrollContext.Provider>
  );
};

export const ScrollContext = createContext<ScrollContextProps | null>(null);
