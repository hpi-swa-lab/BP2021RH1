const setupMatomo = (url: string) => {
  const w: any = window;
  const _paq: Array<any> = (w._paq = w._paq || []);
  /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
  _paq.push(['trackPageView']);
  _paq.push(['enableLinkTracking']);
  _paq.push(['requireCookieConsent']);
  _paq.push(['disableCookies']);
  (function () {
    _paq.push(['setTrackerUrl', url + 'matomo.php']);
    _paq.push(['setSiteId', '1']);
    const d = document,
      g = d.createElement('script'),
      s = d.getElementsByTagName('script')[0];
    g.async = true;
    g.src = url + 'matomo.js';
    s.parentNode!.insertBefore(g, s);
  })();
};

const getLocation = () => window.location.href;

let lastLocation: string = getLocation();
export const trackHistory = () => {
  const newLocation = getLocation();
  if (newLocation === lastLocation) {
    return;
  }
  const w: any = window;
  const _paq: Array<any> = (w._paq = w._paq || []);
  _paq.push(['setCustomUrl', newLocation]);
  _paq.push(['setReferrerUrl', lastLocation]);
  _paq.push(['trackPageView']);
  lastLocation = newLocation;
};

export default setupMatomo;
