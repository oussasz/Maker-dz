import { Order, Cart, Product, User } from "../../models/mysql/index.js";

export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, shippingAddress, subtotal, total, cartId } = req.body;

    if (!items || !shippingAddress || !subtotal || !total) {
      return res.status(400).json({
        error: "Items, shippingAddress, subtotal and total are required",
      });
    }

    const orderId = await Order.create({
      user_id: userId,
      items,
      shipping_address: shippingAddress,
      subtotal,
      total,
    });

    // Clear cart after successful order
    if (orderId) {
      await Cart.clear(userId);
      console.log("Cart is now empty");
    }

    const order = await Order.findById(orderId);

    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Error creating order" });
  }
};

export const getOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.findByUserId(userId);
    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
};

export const getOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Verify the user owns this order
    if (order.user_id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Error fetching order" });
  }
};

export const getSellerOrders = async (req, res) => {
  try {
    const { sellerId } = req.params;

    // Verify seller exists
    const seller = await User.findById(sellerId);
    if (!seller || seller.role !== "seller") {
      return res.status(404).json({ error: "Seller not found" });
    }

    const orders = await Order.findBySellerId(sellerId);
    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching seller orders:", error);
    res.status(500).json({ error: "Error fetching seller orders" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const success = await Order.updateStatus(orderId, status);
    if (!success) {
      return res.status(404).json({ error: "Order not found" });
    }

    const order = await Order.findById(orderId);
    res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Error updating order status" });
  }
};

export const getDashboardData = async (req, res) => {
  try {
    const { sellerId } = req.params;

    const seller = await User.findById(sellerId);
    if (!seller || seller.role !== "seller") {
      return res.status(404).json({ error: "Seller not found" });
    }

    // Get recent orders for this seller
    const orders = await Order.findBySellerId(sellerId);
    const recentOrders = orders.slice(0, 5);

    // Calculate stats
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => {
      const orderItems = JSON.parse(order.items || "[]");
      return (
        sum +
        orderItems.reduce((itemSum, item) => {
          if (item.sellerId == sellerId) {
            return itemSum + item.price * item.quantity;
          }
          return itemSum;
        }, 0)
      );
    }, 0);

    const pendingOrders = orders.filter(
      (o) => o.order_status === "pending",
    ).length;
    const processingOrders = orders.filter(
      (o) => o.order_status === "processing",
    ).length;
    const completedOrders = orders.filter(
      (o) => o.order_status === "delivered",
    ).length;

    // Get seller products count
    const { total: totalProducts } = await Product.findAll({
      filters: { seller_id: sellerId },
      limit: 1,
      offset: 0,
    });

    res.status(200).json({
      stats: {
        totalOrders,
        totalRevenue,
        pendingOrders,
        processingOrders,
        completedOrders,
        totalProducts,
      },
      recentOrders,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ error: "Error fetching dashboard data" });
  }
};

export const updateSellerOrders = async (req, res) => {
  try {
    // In MySQL, orders are already linked via seller_id in items
    res.status(200).json({ message: "Seller orders tracked automatically" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
