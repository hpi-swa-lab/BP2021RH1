import { History } from 'history';
import { PropsWithChildren, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useAnonymousId } from '../hooks/anonymous-id.hook';
import { trackHistory } from './matomo';

export const TrackHistoryWithMatomo = ({ children }: PropsWithChildren<{}>) => {
  const history: History = useHistory();
  const anonymousId = useAnonymousId();
  useEffect(() => {
    const unlisten = history.listen(() => {
      trackHistory();
    });
    return unlisten;
  }, [history]);
  useEffect(() => {
    const w: any = window;
    const _paq: Array<any> = (w._paq = w._paq || []);
    _paq.push([
      function (this: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        this.setUserId(anonymousId);
      },
    ]);
  }, [anonymousId]);
  return <>{children}</>;
};
