/* eslint-disable react-refresh/only-export-components */
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react';
import { ClipboardEditor } from './ClipboardEditor';

const Context = createContext<[ReactNode, Dispatch<SetStateAction<ReactNode>>] | null>(null);

export const ClipboardEditorProvider = ({ children }: { children: React.ReactNode }) => {
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

export const useSetClipboardEditorButtons = () => {
  return useContext(Context)?.[1];
};
