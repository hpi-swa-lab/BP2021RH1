/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_REACT_APP_API_BASE: string;
  readonly VITE_REACT_APP_CONTACT_MAIL: string;
  readonly VITE_REACT_APP_SENTRY_DSN: string;
  readonly VITE_REACT_APP_ADVANCED_SEARCH: string;
  readonly VITE_REACT_APP_MATOMO_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}