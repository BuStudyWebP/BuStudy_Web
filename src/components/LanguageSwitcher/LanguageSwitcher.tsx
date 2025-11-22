import { useState } from "react";
import i18n from "../../i18n";

const LanguageSwitcher = () => {
  const [lang, setLang] = useState(i18n.language || "ko");

  const toggle = () => {
    const next = lang === "ko" ? "en" : "ko";
    i18n.changeLanguage(next);
    setLang(next);
  };

  return (
    <button
      onClick={toggle}
      className="px-3 py-1 text-sm text-gray-700 border rounded hover:bg-gray-100"
      aria-label={`change-language-to-${lang === "ko" ? "en" : "ko"}`}
    >
      {lang.toUpperCase()}
    </button>
  );
};

export default LanguageSwitcher;
