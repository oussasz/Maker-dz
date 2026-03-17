import { useState, useEffect, useCallback } from "react";
import axios from "../api/axios";

export const useOrders = (sellerId) => {
  const [loading, setLoading] = useState(true);
  const [sellerOrders, setSellerOrders] = useState([]);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/sellers/${sellerId}/orders`);
      setSellerOrders(response.data.orders || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [sellerId]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`/orders/${orderId}/status`, { status: newStatus });
      setSellerOrders((prevOrders) =>
        prevOrders.map((o) =>
          o.id === orderId ? { ...o, order_status: newStatus } : o,
        ),
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const formatTableData = (t) => {
    const rows = [];
    for (const order of sellerOrders) {
      const items = Array.isArray(order.items) ? order.items : [];
      const sellerItems = items.filter(
        (item) => String(item.seller_id) === String(sellerId),
      );

      const shippingAddr =
        order.shippingAddress || order.shipping_address || {};
      const parsed =
        typeof shippingAddr === "string"
          ? JSON.parse(shippingAddr || "{}")
          : shippingAddr;

      for (const item of sellerItems) {
        rows.push({
          date: new Date(order.created_at).toLocaleDateString(),
          product: item.name || t("product_not_found"),
          id: order.id,
          state: order.order_status || "pending",
          quantity: item.quantity,
          price: `${item.price} DZD`,
          total: `${item.subtotal || item.price * item.quantity} DZD`,
          customerName:
            parsed.fullName ||
            parsed.name ||
            `${parsed.firstName || ""} ${parsed.lastName || ""}`.trim() ||
            "",
        });
      }
    }
    return rows;
  };

  return {
    loading,
    sellerOrders,
    updateOrderStatus,
    formatTableData,
    refetch: fetchOrders,
  };
};
