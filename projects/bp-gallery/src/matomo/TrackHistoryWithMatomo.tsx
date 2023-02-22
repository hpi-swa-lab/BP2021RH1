import { History } from 'history';
import { PropsWithChildren } from 'react';
import { useHistory } from 'react-router-dom';
import { trackHistory } from './matomo';

export const TrackHistoryWithMatomo = ({ children }: PropsWithChildren<{}>) => {
  const history: History = useHistory();
  history.listen(() => {
    trackHistory();
  });
  return <>{children}</>;
};
