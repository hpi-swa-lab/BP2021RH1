import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';

const localStorageItemName = 'clipboard';

type ClipboardData = {
  pictureIds: string[];
};

function loadFromLocalStorage(): ClipboardData {
  const item = localStorage.getItem(localStorageItemName);
  if (item === null) {
    return {
      pictureIds: [],
    };
  }
  return JSON.parse(item);
}

function storeIntoLocalStorage(data: ClipboardData) {
  localStorage.setItem(localStorageItemName, JSON.stringify(data));
}

const ClipboardContext = React.createContext<
  null | [ClipboardData, Dispatch<SetStateAction<ClipboardData>>]
>(null);

export const ClipboardProvider: React.FC = ({ children }) => {
  const state = useState(loadFromLocalStorage());
  const [data, _] = state;

  useEffect(() => {
    storeIntoLocalStorage(data);
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
