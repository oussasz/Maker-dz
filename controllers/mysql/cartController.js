import { Cart, Product } from "../../models/mysql/index.js";

export const addToCart = async (req, res) => {
  try {
    const { item } = req.body;
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    if (!item) {
      return res.status(400).json({ error: "Valid item is required" });
    }

    if (!item.productId || !item.variantId || !item.price || !item.quantity) {
      return res.status(400).json({
        error: "The item must have productId, variantId, price, and quantity",
      });
    }

    if (item.quantity < 1) {
      return res.status(400).json({ error: "Quantity must be at least 1" });
    }

    // Get or create cart
    const cart = await Cart.getOrCreate(userId);

    // Add or update item in cart
    await Cart.addItem(cart.id, {
      product_id: item.productId,
      variant_id: item.variantId,
      quantity: item.quantity,
      price: item.price,
      name: item.name || "",
      personalization: item.personalization || null,
    });

    // Get updated cart with items
    const updatedCart = await Cart.findByUserId(userId);

    res.status(200).json({
      message: "Cart updated successfully",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { updates } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    if (!updates || !Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({
        error: "Updates array is required and must not be empty",
      });
    }

    const cart = await Cart.getOrCreate(userId);

    for (const update of updates) {
      if (update.quantity <= 0) {
        await Cart.removeItem(cart.id, update.productId, update.variantId);
      } else {
        await Cart.updateItemQuantity(
          cart.id,
          update.productId,
          update.variantId,
          update.quantity,
        );
      }
    }

    const updatedCart = await Cart.findByUserId(userId);

    res.status(200).json({
      message: "Cart updated successfully",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const cart = await Cart.findByUserId(userId);

    // Prevent caching of cart data
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");

    if (!cart) {
      return res.status(200).json({
        cart: { items: [], totalAmount: 0 },
      });
    }

    res.status(200).json({ cart });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, variantId } = req.query;

    if (!userId || !productId) {
      return res
        .status(400)
        .json({ error: "User ID and product ID are required" });
    }

    const cart = await Cart.getOrCreate(userId);
    await Cart.removeItem(cart.id, productId, variantId);

    const updatedCart = await Cart.findByUserId(userId);

    res.status(200).json({
      message: "Item removed from cart",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const cart = await Cart.getOrCreate(userId);
    await Cart.clear(cart.id);

    res.status(200).json({
      message: "Cart cleared successfully",
      cart: { items: [], totalAmount: 0 },
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
