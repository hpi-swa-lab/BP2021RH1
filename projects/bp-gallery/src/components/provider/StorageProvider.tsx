import { nanoid } from 'nanoid';
import { createContext, Dispatch, PropsWithChildren, SetStateAction } from 'react';
import useStorageState from '../../hooks/storage-state.hook';

type ClipboardData = {
  pictureIds: string[];
};

type State<T> = readonly [T, Dispatch<SetStateAction<T>>];
type StorageData = {
  clipboardState: State<ClipboardData>;
  likedState: State<string[]>;
  anonymousId: State<string>;
};

export const StorageContext = createContext<null | StorageData>(null);

const StorageProvider = ({ children }: PropsWithChildren<{}>) => {
  const clipboardState = useStorageState<ClipboardData>(
    { pictureIds: [] },
    'clipboard',
    sessionStorage
  );

  const generateId = () => nanoid();

  const likedState = useStorageState<string[]>([], 'likes', localStorage);

  const anonymousId = useStorageState<string>(generateId(), 'anonymous_id', sessionStorage);
  return (
    <StorageContext.Provider value={{ clipboardState, likedState, anonymousId }}>
      {children}
    </StorageContext.Provider>
  );
};

export default StorageProvider;
