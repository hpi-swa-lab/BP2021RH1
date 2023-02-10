import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';

const sessionStorageItemName = 'clipboard';

type ClipboardData = {
  pictureIds: string[];
};

function loadFromSessionStorage(): ClipboardData {
  const item = sessionStorage.getItem(sessionStorageItemName);
  if (item === null) {
    return {
      pictureIds: [],
    };
  }
  return JSON.parse(item);
}

function storeIntoSessionStorage(data: ClipboardData) {
  sessionStorage.setItem(sessionStorageItemName, JSON.stringify(data));
}

const ClipboardContext = createContext<
  null | [ClipboardData, Dispatch<SetStateAction<ClipboardData>>]
>(null);

export const ClipboardProvider = ({ children }: { children: React.ReactNode }) => {
  const state = useState(loadFromSessionStorage());
  const [data, _] = state;

  useEffect(() => {
    storeIntoSessionStorage(data);
  }, [data]);

  return <ClipboardContext.Provider value={state}>{children}</ClipboardContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useClipboard = () => {
  const value = useContext(ClipboardContext);
  if (!value) {
    throw new Error('missing clipboard context');
  }
  return value;
};

export default ClipboardProvider;
