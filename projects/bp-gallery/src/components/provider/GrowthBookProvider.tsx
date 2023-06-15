import { GrowthBookProvider as _GrowthBookProvider } from '@growthbook/growthbook-react';
import { PropsWithChildren, useEffect } from 'react';
import { growthbook } from '../../helpers/growthbook';
import { useAnonymousId } from '../../hooks/anonymous-id.hook';

export const GrowthBookProvider = ({ children }: PropsWithChildren<{}>) => {
  const anonymousId = useAnonymousId();

  useEffect(() => {
    growthbook?.loadFeatures({ autoRefresh: true });
  }, []);
  useEffect(() => {
    // Set user attributes for targeting (from cookie, auth system, etc.)
    growthbook?.setAttributes({ ...growthbook.getAttributes(), id: anonymousId });
    const w: any = window;
    const _paq: Array<any> = (w._paq = w._paq || []);
    _paq.push([
      function (this: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        this.setUserId(anonymousId);
      },
    ]);
  });

  return <_GrowthBookProvider growthbook={growthbook}>{children}</_GrowthBookProvider>;
};
