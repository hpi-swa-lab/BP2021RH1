import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import TRANSLATIONS_DE from './shared/locales/de.json';

i18n
  .use(initReactI18next)
  .init({
    debug: true,
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

export default i18n;
