import React, { useState, useEffect, useRef, useCallback } from "react";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";
import { Menu, X, Heart, ShoppingCart, Search, Globe } from "lucide-react";
import { Button } from "../components/ui/button";
import useWishlistStore from "../store/wishlistStore";
import useCartStore from "../store/cartStore";

const Navbar = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef(null);
  const location = useLocation();
  const { t, i18n } = useTranslation("navbar");
  const { wishlist } = useWishlistStore();
  const { cart } = useCartStore();

  const isRTL = i18n.language === "ar";
  const wishlistCount = wishlist?.length || 0;
  const cartCount = cart?.items?.length || 0;

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Reset search on route change
  useEffect(() => {
    if (!location.pathname.startsWith("/search/searched")) {
      setSearchQuery("");
    }
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Debounced search handler
  const handleSearchChange = useCallback((event) => {
    setSearchQuery(event.target.value);
  }, []);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/search/searched/${searchQuery.trim()}`);
      setIsSearchFocused(false);
    }
  };

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang).then(() => {
      // Update HTML attributes
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    });
  };

  const shouldHideNavbar = isAuthenticated && user?.role === "seller";
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  // Quick action buttons for authenticated users
  const QuickActions = ({ className = "", isMobile = false }) => (
    <div className={`flex items-center gap-2 ${className}`}>
      {isAuthenticated && user?.role === "customer" && (
        <>
          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="relative p-2 rounded-full hover:bg-gray-100 transition-all duration-200 group"
            aria-label={`Wishlist ${wishlistCount > 0 ? `(${wishlistCount} items)` : ""}`}
          >
            <Heart
              className={`h-5 w-5 text-gray-600 group-hover:text-primary transition-colors ${wishlistCount > 0 ? "fill-primary text-primary" : ""}`}
            />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary text-white text-xs rounded-full flex items-center justify-center font-medium animate-scale-in">
                {wishlistCount > 99 ? "99+" : wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative p-2 rounded-full hover:bg-gray-100 transition-all duration-200 group"
            aria-label={`Cart ${cartCount > 0 ? `(${cartCount} items)` : ""}`}
          >
            <ShoppingCart className="h-5 w-5 text-gray-600 group-hover:text-primary transition-colors" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-accent text-white text-xs rounded-full flex items-center justify-center font-medium animate-scale-in">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>
        </>
      )}
    </div>
  );

  // Mobile Navigation Links
  const MobileNavLinks = () => (
    <nav className="flex flex-col gap-1 mt-6">
      <Link
        to="/"
        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 font-medium"
        onClick={() => setMobileMenuOpen(false)}
      >
        {t("home")}
      </Link>
      {isAuthenticated && user?.role === "customer" && (
        <>
          <Link
            to="/wishlist"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Heart className="h-5 w-5" />
            {t("wishlist")}
            {wishlistCount > 0 && (
              <span className="ml-auto bg-primary/10 text-primary px-2 py-0.5 rounded-full text-sm">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link
            to="/cart"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            <ShoppingCart className="h-5 w-5" />
            {t("cart")}
            {cartCount > 0 && (
              <span className="ml-auto bg-accent/10 text-accent px-2 py-0.5 rounded-full text-sm">
                {cartCount}
              </span>
            )}
          </Link>
        </>
      )}
    </nav>
  );

  return (
    <>
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-1/2 focus:-translate-x-1/2 focus:z-50 focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-md"
      >
        Skip to main content
      </a>

      <nav
        className={`
          ${shouldHideNavbar ? "hidden" : "flex"}
          w-full items-center justify-center z-40 py-3 md:py-4
          sticky top-0
          transition-all duration-300
          ${
            isScrolled && !isAuthPage
              ? "bg-white/95 backdrop-blur-md shadow-md"
              : isAuthPage
                ? "bg-background"
                : "bg-white shadow-sm"
          }
        `}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="w-full flex items-center justify-between px-4 sm:px-6 lg:px-8 gap-3 md:gap-6">
          {/* Logo */}
          <Link
            to="/"
            className="flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md transition-transform hover:scale-105"
            aria-label="Maker DZ Home"
          >
            <img
              src={Logo}
              alt="Maker DZ"
              className="h-8 sm:h-10 md:h-12 w-auto"
            />
          </Link>

          {/* Desktop: Search + Actions */}
          <div
            className={`
              hidden md:flex items-center gap-4 lg:gap-8 flex-1 justify-end
              transition-all duration-500 ease-in-out
              ${isAuthPage ? "opacity-0 -translate-y-5 pointer-events-none" : "opacity-100 translate-y-0"}
            `}
          >
            {/* Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className={`
                relative transition-all duration-300
                ${isSearchFocused ? "w-72 lg:w-96" : "w-48 lg:w-64"}
              `}
              ref={searchRef}
            >
              <div
                className={`
                relative flex items-center bg-gray-50 rounded-full
                border-2 transition-all duration-200
                ${
                  isSearchFocused
                    ? "border-primary shadow-lg shadow-primary/10"
                    : "border-transparent hover:border-gray-200"
                }
              `}
              >
                <Search
                  className={`
                  absolute ${isRTL ? "right-4" : "left-4"} h-4 w-4 transition-colors
                  ${isSearchFocused ? "text-primary" : "text-gray-400"}
                `}
                />
                <input
                  type="text"
                  placeholder={t("search")}
                  className={`
                    w-full bg-transparent py-2.5 text-sm
                    ${isRTL ? "pr-11 pl-4" : "pl-11 pr-4"}
                    focus:outline-none placeholder:text-gray-400
                  `}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  aria-label="Search products"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className={`
                      absolute ${isRTL ? "left-12" : "right-12"} p-1 rounded-full
                      hover:bg-gray-200 transition-colors
                    `}
                    aria-label="Clear search"
                  >
                    <X className="h-3 w-3 text-gray-400" />
                  </button>
                )}
                <button
                  type="submit"
                  className={`
                    absolute ${isRTL ? "left-3" : "right-3"} p-1.5 rounded-full
                    bg-primary text-white hover:bg-primary/90 transition-colors
                  `}
                  aria-label="Submit search"
                >
                  <Search className="h-3 w-3" />
                </button>
              </div>
            </form>

            {/* Language Switcher */}
            <Select value={i18n.language} onValueChange={handleLanguageChange}>
              <SelectTrigger
                className="w-[130px] border-0 bg-gray-50 hover:bg-gray-100 transition-colors"
                aria-label="Select language"
              >
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-gray-500" />
                  <SelectValue placeholder="Language" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">
                  <span className="flex items-center gap-2">🇺🇸 English</span>
                </SelectItem>
                <SelectItem value="fr">
                  <span className="flex items-center gap-2">🇫🇷 Français</span>
                </SelectItem>
                <SelectItem value="ar">
                  <span className="flex items-center gap-2">🇩🇿 العربية</span>
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Quick Actions */}
            <QuickActions />

            {/* Profile or Login */}
            {isAuthenticated ? (
              <ProfileDrop />
            ) : (
              <Link to="/login">
                <Button
                  className="
                    bg-primary hover:bg-primary/90 text-white 
                    px-6 py-2.5 rounded-full font-medium
                    shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30
                    transition-all duration-200 hover:-translate-y-0.5
                  "
                >
                  {t("login")}
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile: Search + Menu */}
          <div
            className={`
            flex md:hidden items-center gap-2
            ${isAuthPage ? "opacity-0 pointer-events-none" : "opacity-100"}
          `}
          >
            {/* Mobile Search Toggle */}
            <Sheet>
              <SheetTrigger asChild>
                <button
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Open search"
                >
                  <Search className="h-5 w-5 text-gray-600" />
                </button>
              </SheetTrigger>
              <SheetContent side="top" className="pt-12">
                <form onSubmit={handleSearchSubmit} className="w-full">
                  <div className="relative flex items-center bg-gray-50 rounded-full border-2 border-primary">
                    <Search
                      className={`absolute ${isRTL ? "right-4" : "left-4"} h-5 w-5 text-primary`}
                    />
                    <input
                      type="text"
                      placeholder={t("search")}
                      className={`
                        w-full bg-transparent py-3 text-base
                        ${isRTL ? "pr-12 pl-4" : "pl-12 pr-4"}
                        focus:outline-none placeholder:text-gray-400
                      `}
                      value={searchQuery}
                      onChange={handleSearchChange}
                      autoFocus
                    />
                    <button
                      type="submit"
                      className={`absolute ${isRTL ? "left-2" : "right-2"} p-2 rounded-full bg-primary text-white`}
                    >
                      <Search className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              </SheetContent>
            </Sheet>

            {/* Quick Actions for Mobile */}
            <QuickActions isMobile />

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5 text-gray-600" />
                </button>
              </SheetTrigger>
              <SheetContent side={isRTL ? "left" : "right"} className="w-80">
                <SheetHeader>
                  <SheetTitle className="text-left">
                    <img src={Logo} alt="Maker DZ" className="h-8" />
                  </SheetTitle>
                </SheetHeader>

                <MobileNavLinks />

                {/* Language Switcher Mobile */}
                <div className="mt-6 px-4">
                  <p className="text-sm text-gray-500 mb-2">Language</p>
                  <Select
                    value={i18n.language}
                    onValueChange={handleLanguageChange}
                  >
                    <SelectTrigger className="w-full">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">🇺🇸 English</SelectItem>
                      <SelectItem value="fr">🇫🇷 Français</SelectItem>
                      <SelectItem value="ar">🇩🇿 العربية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Auth Button Mobile */}
                <div className="mt-8 px-4">
                  {isAuthenticated ? (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-semibold">
                          {user?.username?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {user?.username}
                        </p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <Link
                        to="/login"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button className="w-full bg-primary hover:bg-primary/90">
                          {t("login")}
                        </Button>
                      </Link>
                      <Link
                        to="/signup"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button variant="outline" className="w-full">
                          {t("signup")}
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
