import { Wishlist, Product } from "../../models/mysql/index.js";

export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!userId || !productId) {
      return res
        .status(400)
        .json({ error: "userId and productId are required" });
    }

    // Check if already in wishlist
    const isInWishlist = await Wishlist.hasProduct(userId, productId);
    if (isInWishlist) {
      return res
        .status(409)
        .json({ error: "The product is already in wishlist" });
    }

    await Wishlist.addProduct(userId, productId);

    const wishlist = await Wishlist.findByUserId(userId);

    res.status(200).json({
      message: "Product successfully added to wishlist!",
      wishlist,
    });
  } catch (error) {
    console.error("Error adding product to wishlist:", error);
    res.status(500).json({ error: "Error adding product to wishlist" });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.query;

    if (!userId || !productId) {
      return res
        .status(400)
        .json({ error: "userId and productId are required" });
    }

    const isInWishlist = await Wishlist.hasProduct(userId, productId);
    if (!isInWishlist) {
      return res.status(409).json({ error: "The product is not in wishlist" });
    }

    await Wishlist.removeProduct(userId, productId);

    const wishlist = await Wishlist.findByUserId(userId);

    res.status(200).json({
      message: "Product successfully removed from wishlist!",
      wishlist,
    });
  } catch (error) {
    console.error("Error removing product from wishlist:", error);
    res.status(500).json({ error: "Error removing product from wishlist" });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { onlyIDs } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const wishlist = await Wishlist.findByUserId(userId);

    if (!wishlist) {
      return res.status(200).json({ wishlist: { products: [] } });
    }

    if (onlyIDs === "true" || onlyIDs === true) {
      // Return only product IDs
      const productIds = wishlist.products.map(
        (p) => p.product_id || p.productId,
      );
      return res.status(200).json({ productIds });
    }

    // Return full wishlist with product details
    const productsWithDetails = await Promise.all(
      wishlist.products.map(async (item) => {
        const product = await Product.findById(
          item.product_id || item.productId,
        );
        return {
          ...item,
          product,
        };
      }),
    );

    res.status(200).json({
      wishlist: {
        ...wishlist,
        products: productsWithDetails,
      },
    });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({ error: "Error fetching wishlist" });
  }
};

export const checkWishlistItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    if (!userId || !productId) {
      return res
        .status(400)
        .json({ error: "userId and productId are required" });
    }

    const isInWishlist = await Wishlist.hasProduct(userId, productId);

    res.status(200).json({ isInWishlist });
  } catch (error) {
    console.error("Error checking wishlist:", error);
    res.status(500).json({ error: "Error checking wishlist" });
  }
};
