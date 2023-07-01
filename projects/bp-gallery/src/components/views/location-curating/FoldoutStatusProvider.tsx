import { PropsWithChildren, useRef } from 'react';
import { FoldoutStatusContext } from './FoldoutStatusContext';

export const FoldoutStatusProvider = ({ children }: PropsWithChildren<{}>) => {
  const foldoutStatus = useRef<{ [key: string]: { isOpen: boolean } }>();
  return (
    <FoldoutStatusContext.Provider value={foldoutStatus}>{children}</FoldoutStatusContext.Provider>
  );
};
