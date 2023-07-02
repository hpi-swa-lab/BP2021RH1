import { PropsWithChildren, useRef } from 'react';
import { FoldoutStatus, FoldoutStatusContext } from './FoldoutStatusContext';

export const FoldoutStatusProvider = ({ children }: PropsWithChildren<{}>) => {
  const foldoutStatus = useRef<FoldoutStatus>();
  return (
    <FoldoutStatusContext.Provider value={foldoutStatus}>{children}</FoldoutStatusContext.Provider>
  );
};
