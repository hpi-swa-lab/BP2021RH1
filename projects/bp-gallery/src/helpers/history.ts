import { trackHistory } from '../matomo/matomo';

export const pushHistoryWithoutRouter = (newLocation: string) => {
  window.history.pushState({}, '', newLocation);
  trackHistory();
};
