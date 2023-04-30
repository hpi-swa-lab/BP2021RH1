import {
  GrowthBook,
  useGrowthBook as _useGrowthBook,
  useFeatureIsOn,
  useFeatureValue,
} from '@growthbook/growthbook-react';

const growthbookApiHost = import.meta.env.VITE_REACT_APP_GROWTHBOOK_APIHOST;
const growthbookClientKey = import.meta.env.VITE_REACT_APP_GROWTHBOOK_CLIENTKEY;

export type AppFeatures = {
  test_button: boolean;
  dummy_experiment: boolean;
};

export type FeatureId = keyof AppFeatures;

export const useGrowthBook = (): GrowthBook<AppFeatures> | undefined =>
  _useGrowthBook<AppFeatures>() ?? undefined;

// useFeatureIsOn returns false when it cannot retrieve a value
export const useFlag = (id: FeatureId): boolean => {
  const enabled = useFeatureIsOn<AppFeatures>(id);
  if (growthbookApiHost && growthbookClientKey) return enabled;
  return true;
};

export const useVariant = ({ id, fallback }: { id: FeatureId; fallback: string }): string =>
  useFeatureValue(id, fallback);
