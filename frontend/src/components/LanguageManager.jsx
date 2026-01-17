import { useEffect } from "react";
import { useTranslation } from "react-i18next";

/**
 * LanguageManager component that ensures proper language initialization
 * and synchronization across the application
 */
const LanguageManager = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Get stored language or browser language
    const storedLang = localStorage.getItem("i18nextLng");
    const browserLang = navigator.language.split("-")[0];
    const supportedLangs = ["en", "ar", "fr"];

    // Determine initial language
    let initialLang = "en";
    if (storedLang && supportedLangs.includes(storedLang)) {
      initialLang = storedLang;
    } else if (supportedLangs.includes(browserLang)) {
      initialLang = browserLang;
    }

    // Set language if different from current
    if (i18n.language !== initialLang) {
      i18n.changeLanguage(initialLang);
    }

    // Apply RTL for Arabic
    document.documentElement.dir = initialLang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = initialLang;
  }, [i18n]);

  // Listen for language changes
  useEffect(() => {
    const handleLanguageChange = (lng) => {
      document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = lng;
      localStorage.setItem("i18nextLng", lng);

      // Force RTL styles update
      if (lng === "ar") {
        document.body.classList.add("rtl");
      } else {
        document.body.classList.remove("rtl");
      }
    };

    i18n.on("languageChanged", handleLanguageChange);

    // Initial setup
    handleLanguageChange(i18n.language);

    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, [i18n]);

  return null;
};

export default LanguageManager;
