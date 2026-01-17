import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(HttpApi)
  .init({
    supportedLngs: ["en", "ar", "fr"],
    fallbackLng: "en",
    debug: false,
    detection: {
      order: ["localStorage", "cookie", "htmlTag", "navigator"],
      caches: ["localStorage", "cookie"],
      lookupLocalStorage: "i18nextLng",
      lookupCookie: "i18next",
      cookieMinutes: 10080, // 7 days
    },
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
      requestOptions: {
        cache: "no-store",
      },
    },
    react: {
      useSuspense: false,
    },
    interpolation: {
      escapeValue: false,
    },
    ns: [
      "navbar",
      "home",
      "hero",
      "login",
      "signup",
      "translation",
      "about",
      "categories",
      "product",
      "products",
      "cart",
      "profile",
      "search",
      "wishlist",
      "homesection",
      "sidebar",
      "seller_dashboard",
      "seller_products",
      "seller_addproduct",
      "seller_updateproduct",
      "seller_orderlist",
      "footer",
      "customer",
    ],
    defaultNS: "translation",
  });

i18n.on("languageChanged", (lng) => {
  const html = document.documentElement;

  html.lang = lng;

  // Only set font for Arabic, don't change dir to avoid layout issues
  // The dir="rtl" attribute breaks flexbox layouts throughout the app
  // Instead, we rely on CSS font rules for Arabic text rendering

  // Store language preference
  localStorage.setItem("i18nextLng", lng);
  document.cookie = `i18next=${lng};path=/;max-age=604800`; // 7 days
});

export default i18n;
