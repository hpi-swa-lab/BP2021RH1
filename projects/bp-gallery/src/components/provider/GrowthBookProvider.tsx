import {
  GrowthBook,
  GrowthBookProvider as _GrowthBookProvider,
} from '@growthbook/growthbook-react';
import { PropsWithChildren, useEffect } from 'react';
import { AppFeatures } from '../../helpers/growthbook';

export function GrowthBookProvider({
  children,
  growthbook,
}: PropsWithChildren<{ growthbook: GrowthBook<AppFeatures> | undefined }>) {
  useEffect(() => {
    growthbook?.loadFeatures({ autoRefresh: true, timeout: 2000 });
    // Set user attributes for targeting (from cookie, auth system, etc.)
    let visitor_id: string;
    const w: any = window;
    const _paq: Array<any> = (w._paq = w._paq || []);
    _paq.push([
      function (this: any) {
        visitor_id = this.getVisitorId();
        growthbook?.setAttributes({ ...growthbook.getAttributes(), id: visitor_id });
      },
    ]);
  });

  return <_GrowthBookProvider>{children}</_GrowthBookProvider>;
}
