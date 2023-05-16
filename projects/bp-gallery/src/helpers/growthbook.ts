import type { WidenPrimitives } from '@growthbook/growthbook';
import {
  GrowthBook,
  useGrowthBook as _useGrowthBook,
  useFeatureIsOn,
} from '@growthbook/growthbook-react';

export const growthbookApiHost = import.meta.env.VITE_REACT_APP_GROWTHBOOK_APIHOST;

export const growthbookClientKey = import.meta.env.VITE_REACT_APP_GROWTHBOOK_CLIENTKEY;

export type AppFeatures = {
  test_button: boolean;
  dummy_experiment: boolean;
  paypal_mainpage: {
    clientId: string;
    donationText: string;
    purposeText: string;
  };
  geopictures_collection_id: string;
};

export type FeatureId = keyof AppFeatures;

export const growthbook =
  growthbookApiHost && growthbookClientKey
    ? new GrowthBook({
        apiHost: growthbookApiHost,
        clientKey: growthbookClientKey,
        enableDevMode: import.meta.env.MODE === 'development',
        trackingCallback: (experiment, result) => {
          const w: any = window;
          const _paq: Array<any> = (w._paq = w._paq || []);
          _paq.push([
            'trackEvent',
            'ExperimentViewed',
            experiment.key,
            'v' + String(result.variationId),
          ]);
        },
        onFeatureUsage: (featureKey, result) => {
          const w: any = window;
          const _paq: Array<any> = (w._paq = w._paq || []);
          _paq.push([
            'trackEvent',
            'FeatureViewed' + '_' + String(result.source),
            featureKey,
            String(result.value),
            Number(result.experimentResult?.variationId),
          ]);
        },
      })
    : undefined;

export const useGrowthBook = (): GrowthBook<AppFeatures> | undefined =>
  _useGrowthBook<AppFeatures>() ?? undefined;

// useFeatureIsOn returns false when it cannot retrieve a value
export const useFlag = (id: FeatureId): boolean => {
  const enabled = useFeatureIsOn<AppFeatures>(id);
  if (growthbook) return enabled;
  return true;
};

export const useVariant = <Id extends FeatureId>({
  id,
  fallback,
}: {
  id: Id;
  fallback: AppFeatures[Id];
}): WidenPrimitives<AppFeatures[Id]> => {
  const growthbook = useGrowthBook();
  return growthbook
    ? growthbook.getFeatureValue(id, fallback)
    : (fallback as WidenPrimitives<AppFeatures[Id]>);
};
