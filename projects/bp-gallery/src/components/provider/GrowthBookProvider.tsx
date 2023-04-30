import { GrowthBookProvider as _GrowthBookProvider } from '@growthbook/growthbook-react';
import { PropsWithChildren, useEffect } from 'react';
import { growthbook } from '../../helpers/growthbook';

export const GrowthBookProvider = ({ children }: PropsWithChildren<{}>) => {
  useEffect(() => {
    growthbook?.loadFeatures({ autoRefresh: true });
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
        growthbook?.setAttributes({ ...growthbook.getAttributes(), id: visitor_id });
      },
    ]);

    const refresh = () => {
      if (!growthbook) return;
      growthbook.refreshFeatures();
    };

    const r = setInterval(refresh, 5000);
    return () => clearInterval(r);
  });

  return <_GrowthBookProvider growthbook={growthbook}>{children}</_GrowthBookProvider>;
};
