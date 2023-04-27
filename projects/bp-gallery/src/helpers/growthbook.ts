import {
  GrowthBook,
  useFeatureIsOn as _useFeatureIsOn,
  useFeatureValue as _useFeatureValue,
  useGrowthBook as _useGrowthBook,
} from '@growthbook/growthbook-react';

export type AppFeatures = {
  test_button: boolean;
};

export type FeatureId = keyof AppFeatures;

export const useGrowthBook = (): GrowthBook<AppFeatures> | undefined =>
  _useGrowthBook<AppFeatures>();

export const useFeatureIsOn = (id: FeatureId): boolean => _useFeatureIsOn<AppFeatures>(id);

export const useFeatureValue = ({ id, fallback }: { id: FeatureId; fallback: string }): string =>
  _useFeatureValue(id, fallback);
