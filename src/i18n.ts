import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ko from "./locales/ko/common.json";
import en from "./locales/en/common.json";

i18n.use(initReactI18next).init({
  resources: {
    ko: { common: ko },
    en: { common: en },
  },
  lng: "ko",
  fallbackLng: "ko",
  ns: ["common"],
  defaultNS: "common",
  interpolation: { escapeValue: false },
});

export default i18n;
