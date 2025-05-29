// src/i18n/config.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translation files
import enTranslations from "./locales/en.json";
import azTranslations from "./locales/az.json";

const resources = {
  en: {
    translation: enTranslations,
  },
  az: {
    translation: azTranslations,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    lng: "en", // default language

    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },

    interpolation: {
      escapeValue: false,
    },

    // Add namespace support
    defaultNS: "translation",
    ns: ["translation"],
  });

export default i18n;
