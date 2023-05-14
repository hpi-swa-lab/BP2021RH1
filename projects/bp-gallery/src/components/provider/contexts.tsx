import { createContext, MutableRefObject } from 'react';

type ScrollContextProps = {
  scrollPos: number;
  scrollHeight: number;
  scrollTo: ((scrollPos: number, smooth?: boolean) => void) | undefined;
  useWindow?: boolean;
  elementRef: MutableRefObject<HTMLElement | null>;
};

export const ScrollContext = createContext<ScrollContextProps | null>(null);

//exists to avoid constant rerenders on components that only need the scroll position on e.g. click
export const ScrollRefContext = createContext<MutableRefObject<number> | null>(null);
