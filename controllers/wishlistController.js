import Wishlist from "../models/Wishlist.js";

export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!userId || !productId) {
      return res
        .status(404)
        .json({ error: "userId and productId are required" });
    }

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        userId,
        products: [{ productId, addedAt: Date.now() }],
      });
      return res.status(201).json({ message: "Wishlist Created", wishlist });
    }

    const isInWishlist = !!wishlist.products.find(
      (prod) => prod.productId === productId
    );

    if (isInWishlist) {
      return res
        .status(409)
        .json({ error: "The product is already in wishlist" });
    }

    const newWishlist = await Wishlist.findOneAndUpdate(
      { userId },
      { $push: { products: { productId, addedAt: Date.now() } } }
    );

    res.status(200).json({
      message: "Product successfully added to wishlist!",
      wishlist: newWishlist,
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
        .status(404)
        .json({ error: "userId and productId are required" });
    }

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res
        .status(404)
        .json({ message: "User have no items in wishlist" });
    }

    const isInWishlist = !!wishlist.products.find(
      (prod) => prod.productId.toString() === productId
    );

    if (!isInWishlist) {
      return res
        .status(409)
        .json({ error: "The product is already not in wishlist" });
    }

    const newWishlist = await Wishlist.findOneAndUpdate(
      { userId },
      { $pull: { products: { productId } } }
    );

    res.status(200).json({
      message: "Product successfully removed from wishlist!",
      wishlist: newWishlist,
    });
  } catch (error) {
    console.error("Error removing product from wishlist:", error);
    res.status(500).json({ error: "Error removing product from wishlist" });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const { onlyIDs } = req.query;

    let wishlist;

    if (onlyIDs === "true" || onlyIDs === true) {
      wishlist = await Wishlist.findOne({ userId: req.user.id });
    } else {
      wishlist = await Wishlist.findOne({ userId: req.user.id }).populate(
        "products.productId"
      );
    }

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    let response;

    if (onlyIDs === "true" || onlyIDs === true) {
      response = {
        wishlist: wishlist.products.map((item) => item.productId.toString()),
      };
    } else {
      const wishlistProducts = wishlist.products.map((prod) => prod.productId)
      response = {
        wishlist: wishlistProducts,
      };
    }

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
