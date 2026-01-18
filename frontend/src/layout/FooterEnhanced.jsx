import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useAuth from "../store/authStore";
import Logo from "../assets/Logo.png";
import {
  Facebook,
  Instagram,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Send,
  Heart,
  CheckCircle2,
} from "lucide-react";
import { Button } from "../components/ui/button";

const Footer = () => {
  const { isAuthenticated, user } = useAuth();
  const { t, i18n } = useTranslation("footer");
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const isRTL = i18n.language === "ar";

  const shouldHideFooter = isAuthenticated && user?.role === "seller";
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  if (shouldHideFooter || isAuthPage) return null;

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      // Add newsletter subscription logic here
      setIsSubscribed(true);
      setTimeout(() => setIsSubscribed(false), 3000);
      setEmail("");
    }
  };

  const footerLinks = {
    shop: [
      { label: t("all_products"), href: "/products" },
      { label: t("categories"), href: "/categories" },
      { label: t("new_arrivals"), href: "/new-arrivals" },
    ],
    aboutUs: [{ label: t("our_story"), href: "/about" }],
    support: [
      { label: t("contact_us"), href: "/contact" },
      { label: t("faq"), href: "/faq" },
    ],
    legal: [
      { label: t("privacy_policy"), href: "/privacy" },
      { label: t("terms_of_service"), href: "/terms" },
      { label: t("cookie_policy"), href: "/cookies" },
      { label: t("accessibility"), href: "/accessibility" },
    ],
  };

  const socialLinks = [
    {
      icon: Instagram,
      href: "https://www.instagram.com/makerdz9?igsh=bmdmdmE4N2piNGZs",
      label: "Instagram",
    },
    {
      icon: Facebook,
      href: "https://www.facebook.com/profile.php?id=61583485027931",
      label: "Facebook",
    },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left max-w-md">
              <h3 className="text-2xl font-bold text-white mb-2">
                {t("newsletter_title")}
              </h3>
              <p className="text-gray-400">{t("newsletter_subtitle")}</p>
            </div>

            <form
              onSubmit={handleNewsletterSubmit}
              className="flex w-full max-w-md gap-3"
            >
              <div className="relative flex-1">
                <Mail
                  className={`absolute ${isRTL ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500`}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("email_placeholder")}
                  required
                  className={`
                    w-full ${isRTL ? "pr-12 pl-4" : "pl-12 pr-4"} py-3
                    bg-gray-800 border border-gray-700 rounded-xl
                    text-white placeholder:text-gray-500
                    focus:outline-none focus:border-primary
                    transition-colors
                  `}
                />
              </div>
              <Button
                type="submit"
                disabled={isSubscribed}
                className="px-6 py-3 rounded-xl bg-primary hover:bg-primary/90"
              >
                {isSubscribed ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <img
                src={Logo}
                alt="Maker DZ"
                className="h-10 brightness-0 invert"
              />
            </Link>
            <p className="text-gray-400 mb-6 max-w-sm">
              {t("brand_description")}
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <a
                href="mailto:contact@makerdz.com"
                className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
              >
                <Mail className="h-4 w-4" />
                contact@makerdz.com
              </a>
              <a
                href="tel:+213555123456"
                className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
              >
                <Phone className="h-4 w-4" />
                +213 555 123 456
              </a>
              <div className="flex items-start gap-3 text-gray-400">
                <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                <span>Algiers, Algeria</span>
              </div>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t("shop")}</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors inline-flex items-center group"
                  >
                    {link.label}
                    <ArrowRight className="h-3 w-3 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Us Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t("about_us")}</h4>
            <ul className="space-y-3">
              {footerLinks.aboutUs.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors inline-flex items-center group"
                  >
                    {link.label}
                    <ArrowRight className="h-3 w-3 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t("support")}</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors inline-flex items-center group"
                  >
                    {link.label}
                    <ArrowRight className="h-3 w-3 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t("legal")}</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors inline-flex items-center group"
                  >
                    {link.label}
                    <ArrowRight className="h-3 w-3 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <div className="flex items-center gap-1 text-sm text-gray-400">
              <span>
                © {new Date().getFullYear()} Maker DZ. {t("made_with")}
              </span>
              <Heart className="h-4 w-4 text-red-500 fill-red-500" />
              <span>{t("in_algeria")}</span>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-gray-800 text-gray-400 hover:bg-primary hover:text-white transition-all duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>

            {/* Payment Methods */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500">{t("we_accept")}</span>
              <div className="flex items-center gap-2">
                <div className="bg-white rounded px-2 py-1">
                  <span className="text-xs font-bold text-blue-600">VISA</span>
                </div>
                <div className="bg-white rounded px-2 py-1">
                  <span className="text-xs font-bold text-red-500">MC</span>
                </div>
                <div className="bg-white rounded px-2 py-1">
                  <span className="text-xs font-bold text-green-600">CIB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
