import React, { useState } from "react";
import {
  LogOut,
  PlusCircle,
  Star,
  Menu,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuth from "../store/authStore";
import { useTranslation } from "react-i18next";
import logo from "../assets/Logo.png";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion } from "framer-motion";

const SidebarEnhanced = ({ activeTab, navItems }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("sidebar");
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const importantNavItems = [
    {
      link: "/dashboard/products/add",
      name: t("add_product"),
      icon: <PlusCircle size={20} />,
      id: "add_product",
    },
  ];

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  const handleNavigation = (link) => {
    navigate(link);
    setIsOpen(false);
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex flex-col h-full bg-white">
      {/* Logo Section */}
      <div className="p-4 lg:p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Maker DZ" className="h-10 w-auto" />
          {!isCollapsed && (
            <div className="hidden lg:block">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Seller Portal
              </span>
            </div>
          )}
        </div>
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary/25">
              {getInitials(user?.usrname)}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">
                {user?.usrname}
              </h3>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Sparkles size={10} className="text-primary" />
                Verified Seller
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="p-3 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-3 px-1">
          <Star size={14} className="text-amber-500 fill-amber-500" />
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {t("quick_actions")}
          </span>
        </div>
        <ul className="space-y-2">
          {importantNavItems.map((item) => (
            <li key={item.id}>
              <button
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group ${
                  activeTab === item.id
                    ? "bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg shadow-primary/30"
                    : "bg-gradient-to-r from-primary/5 to-primary/10 text-primary hover:from-primary/10 hover:to-primary/20 hover:shadow-md"
                }`}
                onClick={() => handleNavigation(item.link)}
              >
                <span
                  className={`p-2 rounded-lg ${
                    activeTab === item.id
                      ? "bg-white/20"
                      : "bg-primary/10 group-hover:bg-primary/20"
                  }`}
                >
                  {item.icon}
                </span>
                {!isCollapsed && (
                  <>
                    <span className="font-semibold flex-1 text-start">
                      {item.name}
                    </span>
                    <ChevronRight
                      size={16}
                      className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                    />
                  </>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Navigation */}
      <nav className="flex-grow p-3 overflow-y-auto">
        <div className="flex items-center gap-2 mb-3 px-1">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Menu
          </span>
        </div>
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group ${
                  activeTab === item.id
                    ? "bg-gray-900 text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
                onClick={() => handleNavigation(item.link)}
              >
                <span
                  className={`p-2 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? "bg-white/10"
                      : "bg-gray-100 group-hover:bg-gray-200"
                  }`}
                >
                  {item.icon}
                </span>
                {!isCollapsed && (
                  <>
                    <div className="flex-1 text-start">
                      <span className="font-medium block">{item.name}</span>
                      {item.description && (
                        <span
                          className={`text-xs ${activeTab === item.id ? "text-gray-300" : "text-gray-400"}`}
                        >
                          {item.description}
                        </span>
                      )}
                    </div>
                    {activeTab === item.id && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="w-1.5 h-8 bg-primary rounded-full"
                      />
                    )}
                  </>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-t border-gray-100 space-y-3">
        {/* Language Switcher */}
        <div className="relative">
          <select
            onChange={(e) => handleLanguageChange(e.target.value)}
            value={i18n.language}
            className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary p-3 appearance-none cursor-pointer transition-all hover:bg-gray-100"
          >
            <option value="en">🇬🇧 {t("english")}</option>
            <option value="fr">🇫🇷 {t("french")}</option>
            <option value="ar">🇩🇿 {t("arabic")}</option>
          </select>
          <ChevronRight
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none"
          />
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 p-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-300 group"
        >
          <span className="p-2 rounded-lg bg-gray-100 group-hover:bg-red-100 transition-colors">
            <LogOut size={18} />
          </span>
          {!isCollapsed && <span className="font-medium">{t("logout")}</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
        <div className="flex items-center justify-between p-4">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                <Menu size={22} className="text-gray-700" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SidebarContent isMobile={true} />
            </SheetContent>
          </Sheet>

          <img src={logo} alt="Maker DZ" className="h-9 w-auto" />

          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary/25">
            {getInitials(user?.usrname)}
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-72 bg-white border-r border-gray-200/50 flex-col shadow-xl shadow-gray-200/50">
        <SidebarContent />
      </div>
    </>
  );
};

export default SidebarEnhanced;
