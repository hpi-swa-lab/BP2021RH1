import i18n, { TFunction } from 'i18next';
import { initReactI18next } from 'react-i18next';
import TRANSLATIONS_DE from './shared/locales/de.json';

i18n
  .use(initReactI18next)
  .init({
    debug: import.meta.env.MODE === 'development',
    fallbackLng: 'de',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      de: {
        translation: TRANSLATIONS_DE,
      },
    },
  })
  .catch(error => {
    console.log(error);
  });

export const translateErrorMessage = (message: string, t: TFunction, context?: string) =>
  t(`error.${message}`, {
    defaultValue: message,
    context,
  });

export default i18n;
