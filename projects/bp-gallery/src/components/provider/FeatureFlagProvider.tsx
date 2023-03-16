import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';

const sessionStorageItemName = 'featureFlags';

type FeatureFlag = {
  name: string;
  feature_flag_options: {
    name: string;
    weight: number;
  };
};
type FeatureFlagData = {
  featureFlags: FeatureFlag[];
};

function loadFromSessionStorage(): FeatureFlagData {
  const item = sessionStorage.getItem(sessionStorageItemName);
  if (item === null) {
    return {
      featureFlags: [],
    };
  }
  return JSON.parse(item);
}

function storeIntoSessionStorage(data: any) {
  sessionStorage.setItem(sessionStorageItemName, JSON.stringify(data));
}

const FeatureFlagContext = createContext<
  null | [FeatureFlagData, Dispatch<SetStateAction<FeatureFlagData>>]
>(null);

export const FeatureFlagProvider = ({ children }: PropsWithChildren<{}>) => {
  const state = useState(loadFromSessionStorage());
  const [data, _] = state;

  useEffect(() => {
    storeIntoSessionStorage(data);
  }, [data]);

  return <FeatureFlagContext.Provider value={state}>{children}</FeatureFlagContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useFeatureFlags = () => {
  const value = useContext(FeatureFlagContext);
  if (!value) {
    throw new Error('missing featureFlag context');
  }
  return value;
};

export default FeatureFlagProvider;
