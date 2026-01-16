import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import productModel from "../models/Product.js";
import User from "../models/SimpleUser.js";

export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, shippingAddress, subtotal, total, cartId } = req.body;

    if (!items || !shippingAddress || !subtotal || !total) {
      res.status(400).json({
        error: "Items, shippingAddress, subtotal and total are required",
      });
    }

    const order = await Order.create({
      items,
      shippingAddress,
      subtotal,
      total,
      userId,
    });

    let cart = null;

    if (order && cartId) {
      cart = await Cart.findByIdAndUpdate(cartId, { items: [] });
      console.log("Cart is now empty");
    }

    res.status(201).json({ message: "Order created succefully", order, cart });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Error creating order" });
  }
};

export const updateSellerOrders = async (req, res) => {
  const { sellerId } = req.params;
  const { orderId } = req.body;

  try {
    const seller = await User.findById(sellerId);
    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    seller.orders.push(orderId);
    await seller.save();

    res.status(200).json({ message: "Seller orders updated successfully" });
  } catch (error) {
    console.error("Error updating seller orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getSellerOrders = async (req, res) => {
  const { sellerId } = req.params;

  try {
    const orders = await Order.aggregate([
      // Match orders that have items from this seller
      { $match: { "items.sellerId": new mongoose.Types.ObjectId(sellerId) } },

      // Unwind the items array to work with individual items
      { $unwind: "$items" },

      // Filter to keep only items from this seller
      { $match: { "items.sellerId": new mongoose.Types.ObjectId(sellerId) } },

      // Lookup product details from Product collection
      {
        $lookup: {
          from: "products", // Make sure this matches your Product collection name
          localField: "items.productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },

      // Lookup user details
      {
        $lookup: {
          from: "users", // Make sure this matches your User collection name
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },

      // Unwind the productDetails array (since lookup returns an array)
      {
        $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true },
      },

      // Unwind the userDetails array
      { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } },

      // Project the fields you want
      {
        $project: {
          _id: 0,
          orderId: "$_id",
          orderDate: "$createdAt",
          orderStatus: "$orderStatus",
          shippingAddress: "$shippingAddress",

          // Item details
          itemId: "$items._id",
          productId: "$items.productId",
          variantId: "$items.variantId",
          personalization: "$items.personalization",
          name: "$items.name",
          quantity: "$items.quantity",
          price: "$items.price",
          subtotal: "$items.subtotal",

          // Product details
          productName: "$productDetails.name",
          productImages: "$productDetails.images",
          productSlug: "$productDetails.slug",

          // User details
          customerId: "$userId",
          customerName: "$userDetails.username",
          customerEmail: "$userDetails.email",

          // Order totals
          orderSubtotal: "$subtotal",
          orderTotal: "$total",
        },
      },

      // Sort by most recent
      { $sort: { orderDate: -1 } },
    ]);

    console.log("Seller orders data retrieved successfully");
    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error getting seller orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getDashboardData = async (req, res) => {
  const { sellerId } = req.params;

  try {
    const sellerObjectId = new mongoose.Types.ObjectId(sellerId);

    // Fetch only the 5 most recent orders
    const orders = await Order.aggregate([
      { $match: { "items.sellerId": sellerObjectId } },
      { $unwind: "$items" },
      { $match: { "items.sellerId": sellerObjectId } },

      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },

      { $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } },

      {
        $project: {
          _id: 0,
          orderId: "$_id",
          orderDate: "$createdAt",
          orderStatus: "$orderStatus",
          shippingAddress: "$shippingAddress",

          itemId: "$items._id",
          productId: "$items.productId",
          variantId: "$items.variantId",
          personalization: "$items.personalization",
          name: "$items.name",
          quantity: "$items.quantity",
          price: "$items.price",
          subtotal: "$items.subtotal",

          productName: "$productDetails.name",
          productImages: "$productDetails.images",
          productSlug: "$productDetails.slug",

          customerId: "$userId",
          customerName: "$userDetails.username",
          customerEmail: "$userDetails.email",

          orderSubtotal: "$subtotal",
          orderTotal: "$total",
        },
      },

      { $sort: { orderDate: -1 } },
      { $limit: 5 } // 👈 only 5 recent
    ]);

    // Summary stats for the entire seller
    const summary = await Order.aggregate([
      { $match: { "items.sellerId": sellerObjectId } },

      {
        $addFields: {
          sellerItems: {
            $filter: {
              input: "$items",
              as: "item",
              cond: { $eq: ["$$item.sellerId", sellerObjectId] },
            },
          },
        },
      },

      { $match: { "sellerItems.0": { $exists: true } } },

      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          numCompleted: {
            $sum: { $cond: [{ $eq: ["$orderStatus", "completed"] }, 1, 0] },
          },
          numPending: {
            $sum: { $cond: [{ $eq: ["$orderStatus", "pending"] }, 1, 0] },
          },
          totalIncome: { $sum: { $sum: "$sellerItems.subtotal" } },
        },
      },
    ]);

    const stats = summary[0] || {
      totalOrders: 0,
      numCompleted: 0,
      numPending: 0,
      totalIncome: 0,
    };

    res.status(200).json({
      orders,
      totalOrders: stats.totalOrders,
      numCompleted: stats.numCompleted,
      numPending: stats.numPending,
      totalIncome: stats.totalIncome,
    });
  } catch (error) {
    console.error("Error getting seller dashboard data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



export const updateOrderStatus = async (req, res) => {
  const orderId = req.params.orderId;
  const newStatus = req.body.status;

  try {
    const order = await Order.findByIdAndUpdate(orderId, {
      orderStatus: newStatus,
    });

    if (!order) {
      return res.status(404).send("Order not found");
    }

    return res.status(200).json({message: "Order status updated successfully", newStatus});
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).send("Internal Server Error");
  }
};

export const deleteOrder = async (req, res) => {
  const orderId = req.params.orderId;
  try {
    const deletedOrder = await Order.findByIdAndDelete(orderId);

    const sellerId = await productModel.findById(deletedOrder.productId)
      .sellerId;

    await User.updateOne(
      { _id: deletedOrder.userId },
      { $pull: { orders: orderId } }
    );

    await User.updateOne({ _id: sellerId }, { $pull: { orders: orderId } });

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getOrdersByStatus = async (req, res) => {
  const status = req.params.status;
  const sellerId = req.params.sellerId;
  try {
    const seller = await User.findById(sellerId);
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    const orders = await Order.find({
      _id: { $in: seller.orders },
      state: status,
    }).sort("-createdAt");

    const totalOrders = orders.length;

    const responseData = {
      orders: orders,
      totalOrders: totalOrders,
    };

    res.status(200).json(responseData);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
  }
};
