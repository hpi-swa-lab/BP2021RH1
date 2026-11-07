import { Location } from 'history';
import { LatLng } from 'leaflet';
import { useCallback, useEffect, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { FoldoutStatus } from '../components/views/location-curating/FoldoutStatusContext';
import { useScrollRef } from '../hooks/context-hooks';
import { trackHistory } from '../matomo-config/matomo';

const routerKeyState = () => ({ key: (window.history.state as { key?: string } | null)?.key });

export const pushHistoryWithoutRouter = (newLocation: string) => {
  window.history.pushState(routerKeyState(), '', newLocation);
  trackHistory();
};

export const replaceHistoryWithoutRouter = (newLocation: string) => {
  window.history.replaceState(routerKeyState(), '', newLocation);
  trackHistory();
};

const openOverlays: { close: () => void }[] = [];
let unblockHistory: (() => void) | undefined;

export const useOverlayStack = (onClose: (() => void) | undefined) => {
  const history = useHistory();
  const onCloseRef = useRef(onClose);
  const overlayRef = useRef<{ close: () => void }>();
  useEffect(() => {
    onCloseRef.current = onClose;
  });
  const isOverlay = Boolean(onClose);

  useEffect(() => {
    if (!isOverlay) {
      return;
    }
    const overlay = { close: () => onCloseRef.current?.() };
    overlayRef.current = overlay;
    openOverlays.push(overlay);
    if (!unblockHistory) {
      // history.block keeps only the last block, so nested views share this one
      unblockHistory = history.block((location, action) => {
        openOverlays[openOverlays.length - 1]?.close();
        const staysOnPage = action === 'POP' && location.key === history.location.key;
        if (staysOnPage) {
          // Cancelling keeps the router on this page; the browser keeps the URL because both
          // entries share the key
          return false;
        }
      });
    }
    return () => {
      overlayRef.current = undefined;
      openOverlays.splice(openOverlays.indexOf(overlay), 1);
      if (!openOverlays.length) {
        unblockHistory?.();
        unblockHistory = undefined;
      }
    };
  }, [history, isOverlay]);

  return useCallback(() => openOverlays[openOverlays.length - 1] === overlayRef.current, []);
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
  const history = useHistory<LocationState | undefined>();
  const location: LocationWithState = useLocation();
  const scrollRef = useScrollRef();

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
    },
    [history, scrollRef]
  );

  return { visit, history, location };
};
