import { useState, useEffect } from "react";
import axios from "../api/axios";

export const useOrders = (sellerId) => {
  const [loading, setLoading] = useState(true);
  const [sellerOrders, setSellerOrders] = useState([]);
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/sellers/${sellerId}/orders`);
        const orders = response.data.orders;
        setSellerOrders(orders);

        if (orders.length > 0) {
          const products = await Promise.all(
            orders.map(async (order) => {
              const productResponse = await axios.get(
                `/products/${order.productId}`
              );
              return productResponse.data;
            })
          );
          setProductData(products);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sellerId]);

  const deleteOrder = async (orderId) => {
    try {
      await axios.delete(`/${sellerId}/orders/${orderId}`);
      setSellerOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId)
      );
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const order = sellerOrders.find((o) => o.orderId === orderId);
      await axios.put(`/${sellerId}/orders/${orderId}`, { status: newStatus });
      const updatedOrder = { ...order, orderStatus: newStatus };
      setSellerOrders((prevOrders) =>
        prevOrders.map((o) => (o.orderId === orderId ? updatedOrder : o))
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const formatTableData = (t) => {
    return sellerOrders.map((order) => ({
      date: new Date(order.orderDate).toLocaleDateString(),
      product: order.productName || t("product_not_found"),
      id: order.orderId || t("order_not_found"),
      state: order.orderStatus,
      quantity: order.quantity,
      price: order.price + " DZD" || t("product_not_found"),
      total: order.orderTotal + " DZD" || t("product_not_found"),
    }));
  };

  return {
    loading,
    sellerOrders,
    productData,
    deleteOrder,
    updateOrderStatus,
    formatTableData,
  };
};
