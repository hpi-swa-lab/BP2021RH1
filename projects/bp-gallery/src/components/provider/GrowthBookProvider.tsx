import {
  FeatureDefinition,
  GrowthBookProvider as _GrowthBookProvider,
} from '@growthbook/growthbook-react';
import { isEqual } from 'lodash';
import { PropsWithChildren, useEffect } from 'react';
import { growthbook, growthbookApiHost, growthbookClientKey } from '../../helpers/growthbook';
import { useStorage } from '../../hooks/context-hooks';

export const GrowthBookProvider = ({ children }: PropsWithChildren<{}>) => {
  const anonymousId = useStorage().anonymousId[0];

  useEffect(() => {
    growthbook?.loadFeatures({ autoRefresh: true });
  }, []);
  useEffect(() => {
    // Set user attributes for targeting (from cookie, auth system, etc.)
    growthbook?.setAttributes({ ...growthbook.getAttributes, id: anonymousId });
    const w: any = window;
    const _paq: Array<any> = (w._paq = w._paq || []);
    _paq.push([
      function (this: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        this.setUserId(anonymousId);
      },
    ]);

    const refresh = () => {
      if (!growthbook) return;
      fetch(`${growthbookApiHost}/api/features/${growthbookClientKey}`).then(res =>
        res.json().then(json => {
          const features: Record<string, FeatureDefinition<any>> = json.features;
          if (!isEqual(features, growthbook?.getFeatures())) growthbook?.setFeatures(features);
        })
      );
    };

    const r = setInterval(refresh, 5000);
    return () => clearInterval(r);
  });

  return <_GrowthBookProvider growthbook={growthbook}>{children}</_GrowthBookProvider>;
};
