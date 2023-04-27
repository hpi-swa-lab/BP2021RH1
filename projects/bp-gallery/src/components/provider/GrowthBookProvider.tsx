import {
  GrowthBook,
  GrowthBookProvider as _GrowthBookProvider,
} from '@growthbook/growthbook-react';
import { PropsWithChildren, useEffect } from 'react';

const growthbookApiHost = import.meta.env.VITE_REACT_APP_GROWTHBOOK_APIHOST;
const growthbookClientKey = import.meta.env.VITE_REACT_APP_GROWTHBOOK_CLIENTKEY;

const growthbook = new GrowthBook({
  apiHost: growthbookApiHost,
  clientKey: growthbookClientKey,
  enableDevMode: true,
  trackingCallback: (experiment, result) => {
    const w: any = window;
    const _paq: Array<any> = (w._paq = w._paq || []);
    _paq.push(['trackEvent', 'ExperimentViewed', experiment.key, 'v' + String(result.variationId)]);
  },
  onFeatureUsage: (featureKey, result) => {
    const w: any = window;
    const _paq: Array<any> = (w._paq = w._paq || []);
    _paq.push(['trackEvent', 'ExperimentViewed', featureKey, 'v' + String(result)]);
  },
});

export const GrowthBookProvider = ({ children }: PropsWithChildren<{}>) => {
  useEffect(() => {
    growthbook.loadFeatures({ autoRefresh: true });
  }, []);
  useEffect(() => {
    // Set user attributes for targeting (from cookie, auth system, etc.)
    let visitor_id: string;
    const w: any = window;
    const _paq: Array<any> = (w._paq = w._paq || []);
    _paq.push([
      function (this: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        visitor_id = this.getVisitorId();
        growthbook.setAttributes({ ...growthbook.getAttributes(), id: visitor_id });
      },
    ]);

    const refresh = (): NodeJS.Timeout => {
      growthbook.refreshFeatures();
      return setTimeout(refresh, 5000);
    };

    const r = refresh();
    return () => clearTimeout(r);
  });

  return <_GrowthBookProvider growthbook={growthbook}>{children}</_GrowthBookProvider>;
};
