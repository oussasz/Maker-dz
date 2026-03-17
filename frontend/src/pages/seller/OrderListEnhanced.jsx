import React, { useState, useMemo } from "react";
import LoadingSpinner from "../../components/ui/loading-spinner";
import useAuth from "../../store/authStore";
import { useTranslation } from "react-i18next";
import { useOrders } from "../../hooks/useOrders";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Input } from "../../components/ui/input";
import {
  Search,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Filter,
  Eye,
  RefreshCw,
  Sparkles,
  ShoppingBag,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Status configuration
const statusConfig = {
  pending: {
    label: "Pending",
    color: "bg-amber-100 text-amber-700 border-amber-200",
    icon: Clock,
    dot: "bg-amber-500",
  },
  shipped: {
    label: "Shipped",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: Truck,
    dot: "bg-blue-500",
  },
  completed: {
    label: "Completed",
    color: "bg-green-100 text-green-700 border-green-200",
    icon: CheckCircle,
    dot: "bg-green-500",
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-700 border-red-200",
    icon: XCircle,
    dot: "bg-red-500",
  },
};

// Enhanced Order Card for Mobile
const OrderCardEnhanced = ({ order, updateOrderStatus, t, index }) => {
  const status = statusConfig[order.state] || statusConfig.pending;
  const StatusIcon = status.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-0">
          {/* Header with Status */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white border-b">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Package size={18} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{order.product}</h3>
                <p className="text-xs text-gray-500">#{order.id}</p>
              </div>
            </div>
            <Select
              value={order.state}
              onValueChange={(value) => updateOrderStatus(order.id, value)}
            >
              <SelectTrigger
                className={`w-auto h-8 px-3 text-xs font-medium border ${status.color}`}
              >
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                {Object.entries(statusConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${config.dot}`} />
                      {config.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Order Details */}
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar size={14} />
              <span>{order.date}</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">{t("quantity")}</p>
                <p className="font-semibold text-gray-900">{order.quantity}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">{t("price")}</p>
                <p className="font-semibold text-gray-900">{order.price}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div>
                <p className="text-xs text-gray-500">{t("total")}</p>
                <p className="text-xl font-bold text-primary">{order.total}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

function OrderListEnhanced() {
  const { user } = useAuth();
  const { t } = useTranslation("seller_orderlist");
  const sellerId = user.id;

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  const { loading, sellerOrders, updateOrderStatus, formatTableData, refetch } =
    useOrders(sellerId);

  const tableData = formatTableData(t);

  // Filter orders
  const filteredOrders = useMemo(() => {
    return tableData.filter((order) => {
      const matchesSearch =
        order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(order.id).includes(searchTerm);
      const matchesStatus =
        statusFilter === "all" || order.state === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [tableData, searchTerm, statusFilter]);

  // Stats
  const orderStats = useMemo(
    () => ({
      total: tableData.length,
      pending: tableData.filter((o) => o.state === "pending").length,
      shipped: tableData.filter((o) => o.state === "shipped").length,
      completed: tableData.filter((o) => o.state === "completed").length,
      cancelled: tableData.filter((o) => o.state === "cancelled").length,
    }),
    [tableData],
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text={t("loading_orders")} />
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
          <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 flex items-center gap-3">
            {t("your_orders")}
            <Sparkles className="w-6 h-6 lg:w-8 lg:h-8 text-primary" />
          </h1>
          <p className="text-gray-500 mt-1 hidden lg:block">
            Manage and track all your customer orders
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => {
              setRefreshing(true);
              refetch().finally(() => setRefreshing(false));
            }}
            disabled={refreshing}
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            {t("refresh", "Refresh")}
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-5 gap-4"
      >
        {[
          {
            label: "Total Orders",
            value: orderStats.total,
            color: "bg-gray-100",
            textColor: "text-gray-600",
          },
          {
            label: "Pending",
            value: orderStats.pending,
            color: "bg-amber-100",
            textColor: "text-amber-600",
          },
          {
            label: "Shipped",
            value: orderStats.shipped,
            color: "bg-blue-100",
            textColor: "text-blue-600",
          },
          {
            label: "Completed",
            value: orderStats.completed,
            color: "bg-green-100",
            textColor: "text-green-600",
          },
          {
            label: "Cancelled",
            value: orderStats.cancelled,
            color: "bg-red-100",
            textColor: "text-red-600",
          },
        ].map((stat, index) => (
          <Card key={stat.label} className="border-0 shadow-md">
            <CardContent className="p-4 text-center">
              <p className="text-xs font-medium text-gray-500 mb-1">
                {stat.label}
              </p>
              <p className={`text-2xl font-bold ${stat.textColor}`}>
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-11 border-gray-200 focus:border-primary focus:ring-primary/20"
          />
        </div>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px] h-11 border-gray-200">
            <Filter size={14} className="mr-2 text-gray-400" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="pending">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Pending
              </div>
            </SelectItem>
            <SelectItem value="shipped">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Shipped
              </div>
            </SelectItem>
            <SelectItem value="completed">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                Completed
              </div>
            </SelectItem>
            <SelectItem value="cancelled">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                Cancelled
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Orders Table / Cards */}
      <AnimatePresence mode="wait">
        {filteredOrders.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center py-16"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
              <ShoppingBag size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm || statusFilter !== "all"
                ? "No orders found"
                : t("no_orders_yet")}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "When customers place orders, they will appear here."}
            </p>
          </motion.div>
        ) : (
          <>
            {/* Desktop Table */}
            <motion.div
              key="table"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="hidden lg:block border-0 shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50/80 hover:bg-gray-50/80 border-b">
                        <TableHead className="font-semibold">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            {t("date")}
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold">
                          {t("id")}
                        </TableHead>
                        <TableHead className="font-semibold">
                          {t("product")}
                        </TableHead>
                        <TableHead className="font-semibold">
                          {t("state")}
                        </TableHead>
                        <TableHead className="font-semibold text-center">
                          {t("quantity")}
                        </TableHead>
                        <TableHead className="font-semibold">
                          {t("price")}
                        </TableHead>
                        <TableHead className="font-semibold">
                          {t("total")}
                        </TableHead>
                        <TableHead className="font-semibold text-center">
                          {t("actions")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order, index) => {
                        const status =
                          statusConfig[order.state] || statusConfig.pending;
                        return (
                          <motion.tr
                            key={order.id || index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.03 }}
                            className="hover:bg-gray-50/50 transition-colors group"
                          >
                            <TableCell className="text-gray-600">
                              {order.date}
                            </TableCell>
                            <TableCell>
                              <code className="text-xs bg-gray-100 px-2 py-1 rounded-md font-mono">
                                #{order.id}
                              </code>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                  <Package
                                    size={16}
                                    className="text-gray-500"
                                  />
                                </div>
                                <span className="font-medium text-gray-900">
                                  {order.product}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Select
                                value={order.state}
                                onValueChange={(value) =>
                                  updateOrderStatus(order.id, value)
                                }
                              >
                                <SelectTrigger
                                  className={`w-[130px] h-8 text-xs font-medium border ${status.color}`}
                                >
                                  <div className="flex items-center gap-1.5">
                                    <span
                                      className={`w-1.5 h-1.5 rounded-full ${status.dot}`}
                                    />
                                    <SelectValue />
                                  </div>
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.entries(statusConfig).map(
                                    ([key, config]) => (
                                      <SelectItem key={key} value={key}>
                                        <div className="flex items-center gap-2">
                                          <span
                                            className={`w-2 h-2 rounded-full ${config.dot}`}
                                          />
                                          {config.label}
                                        </div>
                                      </SelectItem>
                                    ),
                                  )}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="text-center">
                              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-sm font-semibold">
                                {order.quantity}
                              </span>
                            </TableCell>
                            <TableCell className="text-gray-600">
                              {order.price}
                            </TableCell>
                            <TableCell className="font-semibold text-primary">
                              {order.total}
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                >
                                  <Eye size={16} className="text-gray-400" />
                                </Button>
                              </div>
                            </TableCell>
                          </motion.tr>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </motion.div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4">
              {filteredOrders.map((order, index) => (
                <OrderCardEnhanced
                  key={order.id || index}
                  order={order}
                  updateOrderStatus={updateOrderStatus}
                  t={t}
                  index={index}
                />
              ))}
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default OrderListEnhanced;
