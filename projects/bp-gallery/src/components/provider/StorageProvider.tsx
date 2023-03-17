import { createContext, Dispatch, PropsWithChildren, SetStateAction } from 'react';
import useStorageState from '../../hooks/storage-state.hook';

type ClipboardData = {
  pictureIds: string[];
};

type Item<T> = [T, Dispatch<SetStateAction<T>>];
type StorageData = {
  clipboardState: Item<ClipboardData>;
  likedState: Item<string[]>;
};

export const StorageContext = createContext<null | StorageData>(null);

export const StorageProvider = ({ children }: PropsWithChildren<{}>) => {
  const clipboardState = useStorageState<ClipboardData>(
    { pictureIds: [] },
    'clipboard',
    sessionStorage
  );

  const likedState = useStorageState<string[]>([], 'likes', localStorage);

  return (
    <StorageContext.Provider value={{ clipboardState, likedState }}>
      {children}
    </StorageContext.Provider>
  );
};

export default StorageProvider;
