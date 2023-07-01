import { MutableRefObject, createContext, useContext } from 'react';

export const FoldoutStatusContext = createContext<MutableRefObject<
  | {
      [key: string]: {
        isOpen: boolean;
      };
    }
  | undefined
> | null>(null);

export const useFoldoutStatus = () => {
  return useContext(FoldoutStatusContext);
};
