import { useContext } from 'react';
import { StorageContext } from './StorageProvider';

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
