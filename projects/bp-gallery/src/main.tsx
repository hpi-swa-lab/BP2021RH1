import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './i18n';
import { renderRoutes } from 'react-router-config';
import reportWebVitals from './reportWebVitals';
import routes from './components/routes';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import setupMatomo from './matomo';

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

export const root = document.getElementById('root')!;

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
createRoot(root).render(
  <React.StrictMode>
    <BrowserRouter>{renderRoutes(routes)}</BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
