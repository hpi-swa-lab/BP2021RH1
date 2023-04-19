import { History, Location } from 'history';
import { useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useScrollRef } from '../hooks/context-hooks';
import { trackHistory } from '../matomo-config/matomo';

export const pushHistoryWithoutRouter = (newLocation: string) => {
  window.history.pushState({}, '', newLocation);
  trackHistory();
};

export const replaceHistoryWithoutRouter = (newLocation: string) => {
  window.history.replaceState({}, '', newLocation);
  trackHistory();
};

type LocationState = {
  showBack?: boolean;
  scrollPos?: number;
  open?: boolean;
};
type LocationWithState = Location & { state?: LocationState };

export const useVisit = () => {
  const history: History & { location: LocationWithState } = useHistory();
  const location: LocationWithState = useLocation();
  const scrollRef = useScrollRef();

  const visit = useCallback(
    (url: string, options?: { state?: LocationState; wasOpen?: boolean }) => {
      history.replace(history.location.pathname, {
        ...history.location.state,
        scrollPos: scrollRef.current,
        open: options?.wasOpen,
      });
      history.push(url, { showBack: options?.state?.showBack ?? true, ...options?.state });
    },
    [history, scrollRef]
  );

  return { visit, history, location };
};
