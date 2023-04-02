import { createContext, Dispatch, PropsWithChildren, SetStateAction } from 'react';
import useStorageState from '../../hooks/storage-state.hook';

type ClipboardData = {
  pictureIds: string[];
};

type State<T> = readonly [T, Dispatch<SetStateAction<T>>];
type StorageData = {
  clipboardState: State<ClipboardData>;
  likedState: State<string[]>;
};

export const StorageContext = createContext<null | StorageData>(null);

const StorageProvider = ({ children }: PropsWithChildren<{}>) => {
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
