import { trackHistory } from '../matomo-config/matomo';

export const pushHistoryWithoutRouter = (newLocation: string) => {
  window.history.pushState({}, '', newLocation);
  trackHistory();
};
