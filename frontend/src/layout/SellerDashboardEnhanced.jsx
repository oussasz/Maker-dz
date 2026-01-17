import React, { useEffect, useState } from "react";
import SidebarEnhanced from "./SidebarEnhanced";
import { Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

const SellerDashboardEnhanced = () => {
  const [activeTab, setActiveTab] = useState("");
  const location = useLocation().pathname;
  const { t, i18n } = useTranslation("sidebar");
  const isRTL = i18n.language === "ar";

  const navItems = [
    {
      link: "/dashboard",
      name: t("dashboard"),
      icon: <LayoutDashboard size={20} />,
      id: "dashboard",
      description: "Overview & Analytics",
    },
    {
      link: "/dashboard/orders",
      name: t("orders"),
      icon: <ShoppingCart size={20} />,
      id: "orders",
      description: "Manage customer orders",
    },
    {
      link: "/dashboard/products",
      name: t("products"),
      icon: <Package size={20} />,
      id: "products",
      description: "Your product catalog",
    },
  ];

  useEffect(() => {
    navItems.forEach((item) => {
      if (item.link === location) {
        setActiveTab(item.id);
      }
    });
  }, [location]);

  return (
    <div
      className={`flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 w-full ${isRTL ? "lg:flex-row-reverse" : ""}`}
    >
      {/* Enhanced Sidebar */}
      <SidebarEnhanced activeTab={activeTab} navItems={navItems} />

      {/* Main Content Area */}
      <main className="flex-grow overflow-y-auto lg:ml-0 relative">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 p-4 lg:p-8 min-h-screen">
          <AnimatePresence mode="wait">
            <motion.div
              key={location}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default SellerDashboardEnhanced;
