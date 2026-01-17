import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  PlusCircle,
} from "lucide-react";

import { useTranslation } from "react-i18next";

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState("");
  const location = useLocation().pathname;
  const { t } = useTranslation("sidebar");

  console.log(location);

  const navItems = [
    {
      link: "/dashboard",
      name: t("dashboard"),
      icon: <LayoutDashboard size={20} />,
      id: "dashboard",
    },
    {
      link: "/dashboard/orders",
      name: t("orders"),
      icon: <ShoppingCart size={20} />,
      id: "orders",
    },
    {
      link: "/dashboard/products",
      name: t("products"),
      icon: <Package size={20} />,
      id: "products",
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
    <div className="flex flex-col lg:flex-row max-h-screen bg-gray-50 w-full">
      <Sidebar activeTab={activeTab} navItems={navItems} />
      <main className="flex-grow overflow-y-auto h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-2 lg:p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default SellerDashboard;
