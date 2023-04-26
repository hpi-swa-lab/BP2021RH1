import * as Sentry from '@sentry/react';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './components/App';
import { root } from './helpers/app-helpers';
import './i18n';
import setupMatomo from './matomo-config/matomo';
import { TrackHistoryWithMatomo } from './matomo-config/TrackHistoryWithMatomo';
import reportWebVitals from './reportWebVitals';
import { GrowthBook, GrowthBookProvider } from '@growthbook/growthbook-react';

const sentryDsn = import.meta.env.VITE_REACT_APP_SENTRY_DSN;
const matomoUrl = import.meta.env.VITE_REACT_APP_MATOMO_URL;
const growthbookApiHost = import.meta.env.VITE_REACT_APP_GROWTHBOOK_APIHOST;
const growthbookClientKey = import.meta.env.VITE_REACT_APP_GROWTHBOOK_CLIENTKEY;

const growthbook = new GrowthBook({
  apiHost: growthbookApiHost,
  clientKey: growthbookClientKey,
  enableDevMode: false,
});

if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    tracesSampleRate: 1.0,
  });
}

if (matomoUrl) {
  setupMatomo(matomoUrl);
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
createRoot(root).render(
  <React.StrictMode>
    <BrowserRouter>
      <TrackHistoryWithMatomo>
        <GrowthBookProvider growthbook={growthbook}>
          <App />
        </GrowthBookProvider>
      </TrackHistoryWithMatomo>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
