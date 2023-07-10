import { History, Location } from 'history';
import { LatLng } from 'leaflet';
import { useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { FoldoutStatus } from '../components/views/location-curating/FoldoutStatusContext';
import { useScrollRef } from '../hooks/context-hooks';
import { trackHistory } from '../matomo-config/matomo';
import { useGrowthBook } from './growthbook';

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
  openMap?: boolean;
  mapState?: { center: LatLng; zoom: number };
  archiveId?: string;
  openBranches?: FoldoutStatus;
};
export type LocationWithState = Location & { state?: LocationState };

export const useVisit = () => {
  const history: History & { location: LocationWithState } = useHistory();
  const location: LocationWithState = useLocation();
  const scrollRef = useScrollRef();
  const growthbook = useGrowthBook();

  const visit = useCallback(
    (
      url: string,
      options?: {
        state?: LocationState;
        wasOpen?: boolean;
        wasOpenMap?: boolean;
        mapState?: { center: LatLng; zoom: number };
        openBranches?: FoldoutStatus;
        customScrollPos?: number;
      }
    ) => {
      history.replace(history.location.pathname, {
        ...history.location.state,
        scrollPos: options?.customScrollPos ?? scrollRef.current,
        open: options?.wasOpen,
        openMap: options?.wasOpenMap,
        mapState: options?.mapState,
        openBranches: options?.openBranches,
      });
      history.push(url, { showBack: options?.state?.showBack ?? true, ...options?.state });
      growthbook?.setURL(window.location.href);
      growthbook?.refreshFeatures();
    },
    [history, scrollRef, growthbook]
  );

  return { visit, history, location };
};
