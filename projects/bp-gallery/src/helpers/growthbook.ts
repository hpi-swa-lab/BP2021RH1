import { GrowthBook, useFeatureIsOn as _useFeatureIsOn } from '@growthbook/growthbook-react';
import { useGrowthBook as _useGrowthBook } from '@growthbook/growthbook-react';

export type AppFeatures = {
  test_button_navbar: boolean;
  test_button_navbar_experiment: boolean;
};

export const useGrowthBook = (): GrowthBook<AppFeatures> | undefined =>
  _useGrowthBook<AppFeatures>();

export const useFeatureIsOn = (id: keyof AppFeatures & string): boolean =>
  _useFeatureIsOn<AppFeatures>(id);
