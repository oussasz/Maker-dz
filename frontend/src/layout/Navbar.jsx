import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProfileDrop from "../components/common/ProfileDrop";
import Logo from "../assets/Logo.png";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import useAuth from "../store/authStore";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

const Navbar = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef(null);
  const location = useLocation();
  const { t, i18n } = useTranslation("navbar");

  const isRTL = i18n.language === "ar";

  useEffect(() => {
    if (!location.pathname.startsWith("/search/searched")) {
      setSearchQuery("");
    }
  }, [location.pathname]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchQuery !== "") {
      navigate(`/search/searched/${searchQuery}`);
    }
  };

  const shouldHideNavbar = isAuthenticated && user?.role === "seller";
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang).then(() => {
      // Update HTML attributes
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    });
  };

  return (
    <>
      <nav
        className={`${shouldHideNavbar ? "hidden" : "flex"} w-full items-center justify-center z-10 duration-300 py-2 sm:py-3 relative
    ${isAuthPage ? "bg-background shadow-none" : "shadow-md bg-white"}
    transition-all`}
      >
        <div className="w-full flex items-center justify-between px-4 sm:px-6 lg:px-8 gap-2 sm:gap-4">
          {/* Logo - always visible on all screens */}
          <Link to="/" className="flex-shrink-0">
            <img src={Logo} alt="logo" className="h-8 sm:h-10 md:h-12 w-auto" />
          </Link>

          {/* Everything else - hidden on login/signup with fade+slide */}
          <div
            className={`flex items-center gap-2 sm:gap-4 lg:gap-12 transition-all duration-500 ease-in-out flex-1 justify-end
              ${
                isAuthPage
                  ? "opacity-0 -translate-y-5 pointer-events-none"
                  : "opacity-100 translate-y-0"
              }`}
          >
            {/* Search Bar - Responsive width */}
            <form
              onSubmit={handleSearchSubmit}
              className="relative w-32 sm:w-40 md:w-48 lg:w-56 xl:w-64"
              ref={searchRef}
            >
              <input
                type="text"
                placeholder={t("search")}
                className="w-full px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 pr-8 sm:pr-10 bg-secondary rounded-md text-sm sm:text-base"
                value={searchQuery}
                onChange={handleSearchChange}
              />

              <button
                type="submit"
                className={`absolute ${isRTL ? "left-2 sm:left-3 lg:left-4" : "right-2 sm:right-3 lg:right-4"} -translate-y-1/2 top-1/2 text-gray-500`}
                tabIndex={-1}
              >
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  className="text-sm sm:text-base"
                />
              </button>
            </form>

            {/* Language Switcher */}
            <div className="relative hidden md:block">
              <Select
                value={i18n.language}
                onValueChange={handleLanguageChange}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="ar">العربية</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Profile Dropdown or Login Button */}
            {isAuthenticated ? (
              <div className="flex-shrink-0">
                <ProfileDrop />
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-primary hover:bg-primary/90 text-white px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 rounded-md text-sm sm:text-base font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0"
              >
                {t("login")}
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
