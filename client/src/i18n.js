import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import translationEn from "./locales/en/translation.json";
import translationUk from "./locales/ua/translation.json";
import translationDe from "./locales/de/translation.json";

const resources = {
  en: { translation: translationEn },
  uk: { translation: translationUk },
  de: { translation: translationDe },
};

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: "en",
      interpolation: {
        escapeValue: false,
      },
    });
}

export default i18n;
