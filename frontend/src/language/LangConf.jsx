import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslations from "./en.json";
import plTranslations from "./pl.json";

i18n
    .use(initReactI18next)
    .init({
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false
  },
  resources: {
    en:{
        translation: enTranslations,
    },
    pl:{
        translation: plTranslations,
    },
  },
});

export default i18n;