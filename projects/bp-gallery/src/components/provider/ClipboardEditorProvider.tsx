import {
  createContext,
  Dispatch,
  PropsWithChildren,
  ReactNode,
  SetStateAction,
  useState,
} from 'react';
import { ClipboardEditor } from '../common/clipboard/ClipboardEditor';

export const ClipboardEditorContext = createContext<
  [ReactNode, Dispatch<SetStateAction<ReactNode>>] | null
>(null);

const ClipboardEditorProvider = ({ children }: PropsWithChildren<{}>) => {
  const buttonsState = useState<ReactNode>(null);
  return (
    <ClipboardEditorContext.Provider value={buttonsState}>
      {children}
      <ClipboardEditor />
    </ClipboardEditorContext.Provider>
  );
};

export default ClipboardEditorProvider;
