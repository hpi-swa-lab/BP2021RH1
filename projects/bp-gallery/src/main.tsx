import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './components/App';
import { root } from './helpers/app-helpers';
import './i18n';
import setupMatomo from './matomo/matomo';
import { TrackHistoryWithMatomo } from './matomo/TrackHistoryWithMatomo';
import reportWebVitals from './reportWebVitals';

const sentryDsn = import.meta.env.VITE_REACT_APP_SENTRY_DSN;
const matomoUrl = import.meta.env.VITE_REACT_APP_MATOMO_URL;

if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    integrations: [new BrowserTracing()],
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
        <App />
      </TrackHistoryWithMatomo>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
