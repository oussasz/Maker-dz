import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import LoadingSpinner from "../../components/ui/loading-spinner";
import {
  ShoppingCart,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Eye,
  RefreshCw,
  Calendar,
  Users,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "../../store/authStore";
import axios from "../../api/axios";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// Animated counter component
const AnimatedCounter = ({ value, prefix = "", suffix = "" }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const numValue = typeof value === "number" ? value : parseFloat(value) || 0;
    const duration = 1000;
    const steps = 60;
    const increment = numValue / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= numValue) {
        setDisplayValue(numValue);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span>
      {prefix}
      {typeof value === "number" ? displayValue.toLocaleString() : value}
      {suffix}
    </span>
  );
};

// Stat card component
const StatCard = ({ stat, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-500 bg-white relative group">
        {/* Gradient overlay on hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
        />

        <CardContent className="p-6 relative">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                {stat.title}
                {stat.trend && (
                  <span
                    className={`flex items-center text-xs font-semibold ${
                      stat.trend > 0 ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {stat.trend > 0 ? (
                      <ArrowUpRight size={14} />
                    ) : (
                      <ArrowDownRight size={14} />
                    )}
                    {Math.abs(stat.trend)}%
                  </span>
                )}
              </p>
              <h3 className="text-3xl font-bold text-gray-900">
                {typeof stat.value === "number" ? (
                  <AnimatedCounter
                    value={stat.value}
                    prefix={stat.prefix || ""}
                  />
                ) : (
                  stat.value
                )}
              </h3>
              <p className="text-xs text-gray-400">{stat.description}</p>
            </div>

            <motion.div
              animate={{
                rotate: isHovered ? 12 : 0,
                scale: isHovered ? 1.1 : 1,
              }}
              className={`p-4 rounded-2xl ${stat.bgColor}`}
            >
              <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
            </motion.div>
          </div>

          {/* Progress bar */}
          {stat.progress !== undefined && (
            <div className="mt-4">
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stat.progress}%` }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className={`h-full rounded-full ${stat.progressColor || "bg-primary"}`}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

function DashboardEnhanced() {
  const { user } = useAuth();
  const { t } = useTranslation("seller_dashboard");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    orders: [],
    totalOrders: 0,
    numCompleted: 0,
    numPending: 0,
    totalIncome: 0,
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const fetchDashboardData = useCallback(
    async (showRefreshState = false) => {
      try {
        if (showRefreshState) setRefreshing(true);
        else setLoading(true);

        const sellerId = user.id;
        const orderResponse = await axios.get(`/sellers/${sellerId}/dashboard`);

        setDashboardData({
          orders: orderResponse.data.orders || [],
          totalOrders: orderResponse.data.totalOrders || 0,
          numCompleted: orderResponse.data.numCompleted || 0,
          numPending: orderResponse.data.numPending || 0,
          totalIncome: orderResponse.data.totalIncome || 0,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [user.id]
  );

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const tableData = useMemo(() => {
    return dashboardData.orders
      .map((order) => ({
        id: order.orderId,
        orderDate: new Date(order.orderDate).toLocaleDateString(),
        orderNumber: order.orderNumber,
        customer: order.customerName || "Unknown Customer",
        status: order.orderStatus || "pending",
        quantity: order.quantity,
        rawDate: new Date(order.createdAt).getTime(),
        total: order.total || 0,
      }))
      .slice(0, 5);
  }, [dashboardData.orders]);

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return tableData;

    return [...tableData].sort((a, b) => {
      const aVal =
        sortConfig.key === "orderDate" ? a.rawDate : a[sortConfig.key];
      const bVal =
        sortConfig.key === "orderDate" ? b.rawDate : b[sortConfig.key];

      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [tableData, sortConfig]);

  const handleSort = useCallback((key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  const getStatusBadge = useCallback(
    (status) => {
      const statusConfig = {
        delivered: {
          className: "bg-green-100 text-green-700 border-green-200",
          label: t("delivered"),
          dot: "bg-green-500",
        },
        pending: {
          className: "bg-amber-100 text-amber-700 border-amber-200",
          label: t("pending"),
          dot: "bg-amber-500",
        },
        cancelled: {
          className: "bg-red-100 text-red-700 border-red-200",
          label: t("cancelled"),
          dot: "bg-red-500",
        },
        confirmed: {
          className: "bg-blue-100 text-blue-700 border-blue-200",
          label: t("confirmed"),
          dot: "bg-blue-500",
        },
        processing: {
          className: "bg-purple-100 text-purple-700 border-purple-200",
          label: t("processing"),
          dot: "bg-purple-500",
        },
        shipped: {
          className: "bg-indigo-100 text-indigo-700 border-indigo-200",
          label: t("shipped"),
          dot: "bg-indigo-500",
        },
      };

      const config = statusConfig[status.toLowerCase()] || {
        className: "bg-gray-100 text-gray-700",
        label: status,
        dot: "bg-gray-500",
      };

      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.className}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
          {config.label}
        </span>
      );
    },
    [t]
  );

  const completionRate =
    dashboardData.totalOrders > 0
      ? Math.round(
          (dashboardData.numCompleted / dashboardData.totalOrders) * 100
        )
      : 0;

  const statCards = [
    {
      title: t("total_orders"),
      value: dashboardData.totalOrders,
      icon: ShoppingCart,
      description: t("all_time_orders"),
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      gradient: "from-blue-500 to-blue-600",
      trend: 12,
    },
    {
      title: t("completed_sales"),
      value: dashboardData.numCompleted,
      icon: CheckCircle,
      description: t("successfully_delivered"),
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      gradient: "from-green-500 to-green-600",
      progress: completionRate,
      progressColor: "bg-green-500",
    },
    {
      title: t("pending_orders"),
      value: dashboardData.numPending,
      icon: Clock,
      description: t("awaiting_fulfillment"),
      bgColor: "bg-amber-100",
      iconColor: "text-amber-600",
      gradient: "from-amber-500 to-amber-600",
    },
    {
      title: t("total_revenue"),
      value: `DZD ${dashboardData.totalIncome.toLocaleString()}`,
      icon: DollarSign,
      description: t("total_income"),
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
      gradient: "from-purple-500 to-purple-600",
      trend: 8,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text={t("loading_dashboard")} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 flex items-center gap-3">
            {t("dashboard_overview")}
            <Sparkles className="w-8 h-8 text-primary" />
          </h1>
          <p className="text-gray-500 mt-1 hidden lg:block">
            {t("monitor_sales_performance")}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchDashboardData(true)}
            disabled={refreshing}
            className="gap-2"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Calendar size={16} />
            This Month
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <StatCard key={stat.title} stat={stat} index={index} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Sales Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    {t("recent_sales")}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {t("latest_transactions_order_history")}
                  </CardDescription>
                </div>
                <Link to="/dashboard/orders">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-primary hover:text-primary"
                  >
                    View All
                    <ArrowUpRight size={14} />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                      <TableHead
                        className="cursor-pointer hover:text-primary transition-colors font-semibold"
                        onClick={() => handleSort("orderDate")}
                      >
                        {t("order_date")}
                        {sortConfig.key === "orderDate" && (
                          <span className="ml-1">
                            {sortConfig.direction === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </TableHead>
                      <TableHead className="font-semibold">
                        {t("order_hash")}
                      </TableHead>
                      <TableHead className="font-semibold">
                        {t("customer")}
                      </TableHead>
                      <TableHead className="font-semibold">
                        {t("status")}
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:text-primary transition-colors font-semibold text-center"
                        onClick={() => handleSort("quantity")}
                      >
                        {t("quantity")}
                        {sortConfig.key === "quantity" && (
                          <span className="ml-1">
                            {sortConfig.direction === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </TableHead>
                      <TableHead className="w-10" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {sortedData.length > 0 ? (
                        sortedData.map((row, index) => (
                          <motion.tr
                            key={row.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-gray-50/50 transition-colors group"
                          >
                            <TableCell className="font-medium text-gray-600">
                              {row.orderDate}
                            </TableCell>
                            <TableCell>
                              <code className="text-xs bg-gray-100 px-2 py-1 rounded-md font-mono">
                                #{row.id.slice(-6)}
                              </code>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-xs font-medium text-gray-600">
                                  {row.customer.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-gray-700">
                                  {row.customer}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(row.status)}</TableCell>
                            <TableCell className="text-center">
                              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-sm font-semibold">
                                {row.quantity}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Eye size={16} className="text-gray-400" />
                              </Button>
                            </TableCell>
                          </motion.tr>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-12">
                            <div className="flex flex-col items-center gap-3 text-gray-400">
                              <ShoppingCart size={40} strokeWidth={1.5} />
                              <p>{t("no_orders_found")}</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Side Cards */}
        <div className="space-y-6">
          {/* Performance Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="border-0 shadow-lg overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Performance
                </CardTitle>
                <CardDescription>
                  Your seller metrics this month
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Completion Rate */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Order Completion</span>
                    <span className="font-semibold text-green-600">
                      {completionRate}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${completionRate}%` }}
                      transition={{ delay: 0.8, duration: 1 }}
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                    />
                  </div>
                </div>

                {/* Response Rate */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Response Rate</span>
                    <span className="font-semibold text-blue-600">95%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "95%" }}
                      transition={{ delay: 0.9, duration: 1 }}
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                    />
                  </div>
                </div>

                {/* Customer Rating */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Customer Rating</span>
                    <span className="font-semibold text-amber-600">4.8/5</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "96%" }}
                      transition={{ delay: 1, duration: 1 }}
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Products Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="border-0 shadow-lg overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Package className="h-5 w-5 text-purple-600" />
                  {t("top_products")}
                </CardTitle>
                <CardDescription>
                  {t("best_selling_items_this_month")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-32 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-2 border-dashed border-purple-200">
                  <div className="text-center">
                    <Package className="h-10 w-10 text-purple-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-purple-600">
                      {t("product_analytics")}
                    </p>
                    <p className="text-xs text-purple-400">
                      {t("coming_soon")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="border-0 shadow-lg overflow-hidden bg-gradient-to-br from-primary to-primary/90 text-white">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">Add New Product</h3>
                <p className="text-white/80 text-sm mb-4">
                  List your handcrafted items and reach customers worldwide
                </p>
                <Link to="/dashboard/products/add">
                  <Button variant="secondary" className="w-full gap-2">
                    <Package size={18} />
                    Create Listing
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default DashboardEnhanced;
