import { useContext } from 'react';
import { ClipboardEditorContext } from '../components/provider/ClipboardEditorProvider';
import { StorageContext } from '../components/provider/StorageProvider';

export const useStorage = () => {
  const value = useContext(StorageContext);
  if (!value) {
    throw new Error('missing storage context');
  }
  return value;
};

export const useClipboard = () => {
  const value = useContext(StorageContext)?.clipboardState;
  if (!value) {
    throw new Error('missing clipboard context');
  }
  return value;
};

export const useClipboardEditorButtons = () => {
  return useContext(ClipboardEditorContext)?.[0];
};

export const useSetClipboardEditorButtons = () => {
  return useContext(ClipboardEditorContext)?.[1];
};
