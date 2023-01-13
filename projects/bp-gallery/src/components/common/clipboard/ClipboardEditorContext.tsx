import React, { Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react';
import { useEffect } from 'react';
import { ClipboardEditor } from './ClipboardEditor';

const Context = React.createContext<[ReactNode, Dispatch<SetStateAction<ReactNode>>] | null>(null);

export const ClipboardEditorProvider: React.FC = ({ children }) => {
  const buttonsState = useState<ReactNode>(null);
  return (
    <Context.Provider value={buttonsState}>
      {children}
      <ClipboardEditor />
    </Context.Provider>
  );
};

export const useClipboardEditorButtons = () => {
  return useContext(Context)?.[0];
};

export const ClipboardEditorButtons: React.FC = ({ children }) => {
  const setButtons = useContext(Context)?.[1];
  useEffect(() => {
    setButtons?.(children);
    return () => {
      setButtons?.(null);
    };
  }, [setButtons, children]);
  return null;
};
