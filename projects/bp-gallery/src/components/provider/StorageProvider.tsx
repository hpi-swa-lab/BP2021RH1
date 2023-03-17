import { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext } from 'react';
import useStorageState from '../../hooks/storage-state.hook';

const sessionStorageItemName = 'clipboard';

type ClipboardData = {
  pictureIds: string[];
};

const StorageContext = createContext<null | {
  clipboardState: [ClipboardData, Dispatch<SetStateAction<ClipboardData>>];
  likedState: [string[], Dispatch<SetStateAction<string[]>>];
}>(null);

export const StorageProvider = ({ children }: PropsWithChildren<{}>) => {
  const clipboardState = useStorageState<ClipboardData>(
    { pictureIds: [] },
    sessionStorageItemName,
    sessionStorage
  );

  const likedState = useStorageState<string[]>([], 'likes', localStorage);

  return (
    <StorageContext.Provider value={{ clipboardState, likedState }}>
      {children}
    </StorageContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useStorage = () => {
  const value = useContext(StorageContext);
  if (!value) {
    throw new Error('missing clipboard context');
  }
  return value;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useClipboard = () => {
  const value = useContext(StorageContext)?.clipboardState;
  if (!value) {
    throw new Error('missing clipboard context');
  }
  return value;
};

export default StorageProvider;
