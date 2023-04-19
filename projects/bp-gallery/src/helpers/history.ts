import { History, Location } from 'history';
import { useCallback, useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { ScrollRefContext } from '../components/provider/ScrollProvider';
import { trackHistory } from '../matomo-config/matomo';

export const pushHistoryWithoutRouter = (newLocation: string) => {
  window.history.pushState({}, '', newLocation);
  trackHistory();
};

export const replaceHistoryWithoutRouter = (newLocation: string) => {
  window.history.replaceState({}, '', newLocation);
  trackHistory();
};

type LocationWithState = Location & {
  state?: {
    showBack?: boolean;
    scrollPos?: number;
  };
};

export const useVisit = () => {
  const history: History & { location: LocationWithState } = useHistory();
  const location: LocationWithState = useLocation();
  const scrollRef = useContext(ScrollRefContext);

  const visit = useCallback(
    (url: string, showBack = true) => {
      if (scrollRef) {
        history.replace(history.location.pathname, {
          ...(history.location.state as object),
          scrollPos: scrollRef.current,
        });
      }
      history.push(url, { showBack });
    },
    [history, scrollRef]
  );

  return { visit, history, location };
};
