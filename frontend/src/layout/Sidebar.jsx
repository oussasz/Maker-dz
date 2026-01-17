import React, { useEffect, useState } from "react";
import { LogOut, PlusCircle, Star, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuth from "../store/authStore";
import { useTranslation } from "react-i18next";
import logo from "../assets/Logo.png";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Sidebar = ({ activeTab, navItems }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("sidebar");
  const [isOpen, setIsOpen] = useState(false);
  const isRTL = i18n.language === "ar";

  const importantNavItems = [
    {
      link: "/dashboard/products/add",
      name: t("add_product"),
      icon: <PlusCircle size={20} />,
      id: "add_product",
    },
  ];

  useEffect(() => {
    console.log("active tab: ", activeTab);
  }, [activeTab]);

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  const handleNavigation = (link) => {
    navigate(link);
    setIsOpen(false); // Close sheet on navigation
  };

  // Sidebar content component to avoid duplication
  const SidebarContent = () => (
    <>
      <div className="w-full py-2">
        <img src={logo} alt="logo" className="h-10 sm:h-14 md:h-16 w-auto" />
      </div>
      <div className="p-5 border-y border-gray-200">
        <h2 className="text-2xl font-bold">{user.usrname}</h2>
      </div>

      {/* Important Actions Section */}
      <div className="p-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2 mb-3">
          <Star size={16} className="text-amber-500 fill-amber-500" />
          <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            {t("quick_actions")}
          </span>
        </div>
        <ul>
          {importantNavItems.map((item) => (
            <li key={item.id} className="mb-3">
              <a
                href="#"
                className={`flex gap-3 items-center p-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-md ${
                  activeTab === item.id
                    ? "bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg"
                    : "bg-white text-primary border-2 border-primary/20 hover:border-primary/40 hover:shadow-lg"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation(item.link);
                }}>
                <span
                  className={`${activeTab === item.id ? "text-white" : "text-primary"}`}>
                  {item.icon}
                </span>
                <span className="font-semibold flex-1">{item.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Regular Navigation */}
      <nav className="flex-grow p-3">
        <ul>
          {navItems.map((item) => (
            <li key={item.id} className="mb-2">
              <a
                href="#"
                className={`flex gap-3 items-center p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors ${
                  activeTab === item.id
                    ? "bg-primary text-white hover:bg-primary/90"
                    : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation(item.link);
                }}>
                <span>{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-3 border-t border-gray-200">
        {/* Language Switcher */}
        <div className="relative mb-4">
          <select
            onChange={(e) => handleLanguageChange(e.target.value)}
            defaultValue={i18n.language}
            className="bg-secondary border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5">
            <option value="en">{t("english")}</option>
            <option value="fr">{t("french")}</option>
            <option value="ar">{t("arabic")}</option>
          </select>
        </div>
        <button
          onClick={logout}
          className="flex gap-3 cursor-pointer items-center w-full p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
          <LogOut size={20} />
          <span className="font-medium">{t("logout")}</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Navbar with Hamburger Menu */}
      <div className="lg:hidden bg-white border-b border-gray-200 z-50">
        <div className="flex items-center justify-between p-4">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Menu size={24} className="text-gray-700" />
              </button>
            </SheetTrigger>
            <SheetContent
              side={isRTL ? "right" : "left"}
              className="w-64 p-0 flex flex-col">
              <SidebarContent />
            </SheetContent>
          </Sheet>
          <img src={logo} alt="logo" className="h-10 w-auto" />
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-col">
        <SidebarContent />
      </div>
    </>
  );
};

export default Sidebar;
