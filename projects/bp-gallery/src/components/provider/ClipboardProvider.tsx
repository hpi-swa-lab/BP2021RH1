import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';

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

function storeIntosessionStorage(data: ClipboardData) {
  sessionStorage.setItem(sessionStorageItemName, JSON.stringify(data));
}

const ClipboardContext = React.createContext<
  null | [ClipboardData, Dispatch<SetStateAction<ClipboardData>>]
>(null);

export const ClipboardProvider: React.FC = ({ children }) => {
  const state = useState(loadFromSessionStorage());
  const [data, _] = state;

  useEffect(() => {
    storeIntosessionStorage(data);
  }, [data]);

  return <ClipboardContext.Provider value={state}>{children}</ClipboardContext.Provider>;
};

export const useClipboard = () => {
  const value = useContext(ClipboardContext);
  if (!value) {
    throw new Error('missing clipboard context');
  }
  return value;
};

export default ClipboardProvider;
