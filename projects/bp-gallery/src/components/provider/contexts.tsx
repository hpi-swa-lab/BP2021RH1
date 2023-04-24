import { createContext, MutableRefObject } from 'react';
import { ScrollContextProps } from './ScrollProvider';

export const ScrollContext = createContext<ScrollContextProps | null>(null);

//exists to avoid constant rerenders on components that only need the scroll position on e.g. click
export const ScrollRefContext = createContext<MutableRefObject<number> | null>(null);
