import {
  GrowthBook,
  useGrowthBook as _useGrowthBook,
  useFeatureIsOn,
  useFeatureValue,
} from '@growthbook/growthbook-react';

export type AppFeatures = {
  test_button: boolean;
  dummy_experiment: boolean;
};

export type FeatureId = keyof AppFeatures;

export const useGrowthBook = (): GrowthBook<AppFeatures> | undefined =>
  _useGrowthBook<AppFeatures>() ?? undefined;

export const useFlag = (id: FeatureId): boolean => useFeatureIsOn<AppFeatures>(id) ?? true;

export const useVariant = ({ id, fallback }: { id: FeatureId; fallback: string }): string =>
  useFeatureValue(id, fallback) ?? '';
