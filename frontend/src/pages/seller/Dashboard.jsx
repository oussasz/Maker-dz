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
import LoadingSpinner from "../../components/ui/loading-spinner";
import {
  ShoppingCart,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
  Package,
} from "lucide-react";
import useAuth from "../../store/authStore";
import axios from "../../api/axios";
import { useTranslation } from "react-i18next";

function Dashboard() {
  const { user } = useAuth();
  const { t } = useTranslation("seller_dashboard");
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    orders: [],
    totalOrders: 0,
    numCompleted: 0,
    numPending: 0,
    totalIncome: 0,
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Memoized data fetching function
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Fetching dashboard data...");

      const sellerId = user.id;
      const orderResponse = await axios.get(`/sellers/${sellerId}/dashboard`);
      console.log("orderResponse: ", orderResponse.data);

      // Set all dashboard data at once to minimize re-renders
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
    }
  }, [user.id]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Memoized table data transformation
  const tableData = useMemo(() => {
    return dashboardData.orders.map((order) => {
      return {
        id: order.orderId,
        orderDate: new Date(order.orderDate).toLocaleDateString(),
        orderNumber: order.orderNumber,
        customer: order.customerName || "Unknown Customer",
        status: order.orderStatus || "pending",
        quantity: order.quantity,
        rawDate: new Date(order.createdAt).getTime(),
        total: order.total || 0,
      };
    }).slice(0, 5); 
  }, [dashboardData.orders]);

  // Optimized sorting with better performance
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

  // Memoized sort handler
  const handleSort = useCallback((key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  // Memoized status badge component
  const getStatusBadge = useCallback((status) => {
    const statusConfig = {
      delivered: { variant: "default", label: t("delivered") },
      pending: { variant: "secondary", label: t("pending") },
      cancelled: { variant: "destructive", label: t("cancelled") },
      confirmed: { variant: "outline", label: t("confirmed") },
      processing: { variant: "outline", label: t("processing") },
      shipped: { variant: "default", label: t("shipped") },
    };

    const config = statusConfig[status.toLowerCase()] || {
      variant: "outline",
      label: status,
    };

    return (
      <Badge variant={config.variant} className="capitalize">
        {config.label}
      </Badge>
    );
  }, []);

  // Memoized stat cards configuration
  const statCards = [
    {
      title: t("total_orders"),
      value: dashboardData.totalOrders,
      icon: ShoppingCart,
      description: t("all_time_orders"),
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: t("completed_sales"),
      value: dashboardData.numCompleted,
      icon: CheckCircle,
      description: t("successfully_delivered"),
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: t("pending_orders"),
      value: dashboardData.numPending,
      icon: Clock,
      description: t("awaiting_fulfillment"),
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      title: t("total_revenue"),
      value: `DZD ${dashboardData.totalIncome.toLocaleString()}`,
      icon: DollarSign,
      description: t("total_income"),
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
  ];

  // Loading state
  if (loading) {
    return <LoadingSpinner text={t("loading_dashboard")} />;
  }

  return (
    <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100 p-2 lg:p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
            {t("dashboard_overview")}
          </h1>
          <p className="text-gray-600 hidden lg:block">{t("monitor_sales_performance")}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <Card
              key={stat.title}
              className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <h3 className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </h3>
                    <p className="text-xs text-gray-500">{stat.description}</p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Sales Table */}
          <Card className="lg:col-span-2 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                {t("recent_sales")}
              </CardTitle>
              <CardDescription>
                {t("latest_transactions_order_history")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border bg-white overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead
                        className="cursor-pointer hover:bg-gray-100 transition-colors font-semibold"
                        onClick={() => handleSort("orderDate")}>
                        {t("order_date")}{" "}
                        {sortConfig.key === "orderDate" &&
                          (sortConfig.direction === "asc" ? "↑" : "↓")}
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
                        className="cursor-pointer hover:bg-gray-100 transition-colors font-semibold"
                        onClick={() => handleSort("quantity")}>
                        {t("quantity")}{" "}
                        {sortConfig.key === "quantity" &&
                          (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedData.length > 0 ? (
                      sortedData.map((row) => (
                        <TableRow
                          key={row.id}
                          className="hover:bg-gray-50 transition-colors">
                          <TableCell className="font-medium">
                            {row.orderDate}
                          </TableCell>
                          <TableCell className="text-gray-700 font-mono text-sm">
                            {row.id}
                          </TableCell>
                          <TableCell className="text-gray-700">
                            {row.customer}
                          </TableCell>
                          <TableCell>{getStatusBadge(row.status)}</TableCell>
                          <TableCell className="font-semibold">
                            {row.quantity}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-8 text-gray-500">
                          {t("no_orders_found")}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Top Products Card */}
          <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-purple-600" />
                {t("top_products")}
              </CardTitle>
              <CardDescription>
                {t("best_selling_items_this_month")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-center h-48 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border-2 border-dashed border-purple-300">
                  <div className="text-center">
                    <Package className="h-12 w-12 text-purple-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {t("product_analytics")}
                    </p>
                    <p className="text-xs text-gray-500">{t("coming_soon")}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
