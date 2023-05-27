import { nanoid } from 'nanoid';
import {
  createContext,
  Dispatch,
  MutableRefObject,
  PropsWithChildren,
  SetStateAction,
  useEffect,
  useRef,
} from 'react';
import useStorageState from '../../hooks/storage-state.hook';

type ClipboardData = {
  pictureIds: string[];
};

type SelectedTabsData = {
  start?: number;
  discover?: number;
  archives?: { [archiveID: string]: number | undefined };
};

type State<T> = readonly [T, Dispatch<SetStateAction<T>>];
type StorageData = {
  clipboardState: State<ClipboardData>;
  likedState: State<string[]>;
  selectedTabsState: State<SelectedTabsData>;
  anonymousId: State<string>;
};

export const StorageContext = createContext<null | StorageData>(null);

export const AnonymousIdRefContext = createContext<MutableRefObject<string> | null>(null);

const StorageProvider = ({ children }: PropsWithChildren<{}>) => {
  const clipboardState = useStorageState<ClipboardData>(
    { pictureIds: [] },
    'clipboard',
    sessionStorage
  );

  const likedState = useStorageState<string[]>([], 'likes', localStorage);

  const selectedTabsState = useStorageState<SelectedTabsData>(
    { start: undefined, discover: undefined, archives: undefined },
    'selected_tabs',
    localStorage
  );

  const anonymousId = useStorageState<string>(() => nanoid(), 'anonymous_id', sessionStorage);

  const anonymousIdRef = useRef(anonymousId[0]);

  useEffect(() => {
    anonymousIdRef.current = anonymousId[0];
  }, [anonymousId]);
  return (
    <StorageContext.Provider value={{ clipboardState, likedState, selectedTabsState, anonymousId }}>
      <AnonymousIdRefContext.Provider value={anonymousIdRef}>
        {children}
      </AnonymousIdRefContext.Provider>
    </StorageContext.Provider>
  );
};

export default StorageProvider;
