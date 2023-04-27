import {
  GrowthBook,
  useFeatureIsOn as _useFeatureIsOn,
  useFeatureValue as _useFeatureValue,
} from '@growthbook/growthbook-react';
import { useGrowthBook as _useGrowthBook } from '@growthbook/growthbook-react';

export type AppFeatures = {
  test_button: boolean;
};

type FeatureId = keyof AppFeatures & string;

export const useGrowthBook = (): GrowthBook<AppFeatures> | undefined =>
  _useGrowthBook<AppFeatures>();

export const useFeatureIsOn = (id: FeatureId): boolean => _useFeatureIsOn<AppFeatures>(id);

export const useFeatureValue = ({ id, fallback }: { id: FeatureId; fallback: string }): string =>
  _useFeatureValue(id, fallback);
