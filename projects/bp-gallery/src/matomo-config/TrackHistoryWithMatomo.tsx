import { History } from 'history';
import { PropsWithChildren, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { trackHistory } from './matomo';

export const TrackHistoryWithMatomo = ({ children }: PropsWithChildren<{}>) => {
  const history: History = useHistory();
  useEffect(() => {
    const unlisten = history.listen(() => {
      trackHistory();
    });
    return unlisten;
  });
  return <>{children}</>;
};
