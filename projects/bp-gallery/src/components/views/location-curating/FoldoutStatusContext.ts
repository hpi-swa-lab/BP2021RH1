import { MutableRefObject, createContext, useContext } from 'react';

export type FoldoutStatus = {
  [key: string]: {
    isOpen: boolean;
  };
};

export const FoldoutStatusContext = createContext<MutableRefObject<
  FoldoutStatus | undefined
> | null>(null);

export const useFoldoutStatus = () => {
  return useContext(FoldoutStatusContext);
};
