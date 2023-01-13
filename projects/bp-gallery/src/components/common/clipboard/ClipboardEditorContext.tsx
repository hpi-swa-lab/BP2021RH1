import React, { MutableRefObject, useContext, useRef } from 'react';
import { ClipboardEditor } from './ClipboardEditor';

const Context = React.createContext<MutableRefObject<HTMLDivElement | null> | null>(null);

export const ClipboardEditorProvider: React.FC = ({ children }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  return (
    <Context.Provider value={ref}>
      {children}
      <ClipboardEditor buttonsRef={ref} />
    </Context.Provider>
  );
};

export const useClipboardEditorButtons = () => {
  return useContext(Context)?.current ?? null;
};
