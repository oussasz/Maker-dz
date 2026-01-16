import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const addToCart = async (req, res) => {
  try {
    const { item } = req.body;
    const userId = req.user.id;

    // Input validation
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    if (!item) {
      return res.status(400).json({ error: "Valid item is required" });
    }

    // Validate the item

    if (!item.productId || !item.variantId || !item.price || !item.quantity) {
      return res.status(400).json({
        error: "The item must have productId, variantId, price, and quantity",
      });
    }
    if (item.quantity < 1) {
      return res.status(400).json({
        error: "Quantity must be at least 1",
      });
    }

    // Find existing cart or create new one
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // Create new cart if doesn't exist
      const totalAmount = item.price * item.quantity;
      cart = await Cart.create({
        userId,
        item,
        totalAmount,
      });
    } else {
      // Update existing cart - handle duplicate items intelligently

      const existingItemIndex = cart.items.findIndex(
        (oldItem) =>
          oldItem.productId.toString() === item.productId &&
          oldItem.variantId.toString() === item.variantId
      );

      if (existingItemIndex > -1) {
        // Update quantity if item already exists
        cart.items[existingItemIndex].quantity += item.quantity;
      } else {
        // Add new item
        cart.items.push(item);
      }

      // Recalculate total amount
      cart.totalAmount = cart.items.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0);

      await cart.save();
    }

    // Populate product details for response
    const populatedCart = await Cart.populateWithVariants(cart._id);

    res.status(200).json({
      message: "Cart updated successfully",
      cart: populatedCart,
    });
  } catch (error) {
    console.error("Error adding product to cart:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateCart = async (req, res) => {
  try {
    const { userId } = req.body;
    const { updates } = req.body; // Array of updates: [{ productId, variantId, quantity }, ...]

    // Input validation
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    if (!updates || !Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({
        error: "Updates array is required and must not be empty",
      });
    }

    // Validate each update
    for (const update of updates) {
      if (
        !update.productId ||
        !update.variantId ||
        update.quantity === undefined
      ) {
        return res.status(400).json({
          error: "Each update must have productId, variantId, and quantity",
        });
      }

      if (update.quantity < 0) {
        return res.status(400).json({
          error: "Quantity cannot be negative",
        });
      }
    }

    // Find the user's cart
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    let hasChanges = false;

    // Process each update
    for (const update of updates) {
      const { productId, variantId, quantity } = update;

      // Find the item in the cart
      const itemIndex = cart.items.findIndex(
        (item) =>
          item.productId.toString() === productId &&
          item.variantId.toString() === variantId
      );

      if (itemIndex === -1) {
        return res.status(404).json({
          error: `Item with productId ${productId} and variantId ${variantId} not found in cart`,
        });
      }

      if (quantity === 0) {
        // Remove item if quantity is 0
        cart.items.splice(itemIndex, 1);
        hasChanges = true;
      } else if (cart.items[itemIndex].quantity !== quantity) {
        // Update quantity if it's different
        cart.items[itemIndex].quantity = quantity;
        hasChanges = true;
      }
    }

    if (!hasChanges) {
      // No changes needed, return current cart
      const populatedCart = await Cart.populateWithVariants(cart._id);
      return res.status(200).json({
        message: "No changes made to cart",
        cart: populatedCart,
      });
    }

    // Recalculate total amount
    cart.totalAmount = cart.items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    // Save the updated cart
    await cart.save();

    // Populate product details for response
    const populatedCart = await Cart.populateWithVariants(cart._id);

    res.status(200).json({
      message: "Cart updated successfully",
      cart: populatedCart,
    });
  } catch (error) {
    console.error("Error updating cart:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { productId, variantId, quantity, personalization } = req.body;
    const userId = req.user.id;

    if (!userId || !productId || !variantId) {
      return res.status(400).json({
        error: "userId, productId, and variantId are required",
      });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    // find item by product ONLY (variant may change)
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    const currentItem = cart.items[itemIndex];

    // get new variant info
    const product = await Product.findById(productId);
    const newVariant = product.variants.find(
      (v) => v._id.toString() === variantId
    );

    if (!newVariant) {
      return res.status(400).json({ error: "Variant not found" });
    }

    // --- QUANTITY HANDLING ---
    let finalQuantity;

    if (quantity === undefined || quantity === null) {
      // If qty absent → keep original
      finalQuantity = currentItem.quantity;
    } else if (quantity <= 0) {
      // If qty is zero remove item
      cart.items.splice(itemIndex, 1);
    } else {
      // Valid quantity
      finalQuantity = quantity;
      currentItem.quantity = finalQuantity;
    }

    // If item still exists (not removed)
    if (cart.items[itemIndex]) {
      currentItem.variantId = variantId;
      currentItem.price = newVariant.price;

      if (
        personalization !== undefined &&
        personalization !== currentItem.personalization
      ) {
        currentItem.personalization = personalization;
      }
    }

    // Recalculate total
    cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    await cart.save();

    const populatedCart = await Cart.populateWithVariants(cart._id);

    res.status(200).json({
      message: "Cart item updated successfully",
      cart: populatedCart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId });
    const populatedCart = await Cart.populateWithVariants(cart._id);

    res
      .status(200)
      .json({ message: "cart fetched succefully", cart: populatedCart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching cart" });
  }
};
