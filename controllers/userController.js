import userModel from "../models/SimpleUser.js";

export const likeProduct = async (req, res) => {
  try {
    const userId = req.params.userId;
    const productId = req.params.productId;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isLiked = user.liked.includes(productId);

    if (isLiked) {
      const index = user.liked.indexOf(productId);
      if (index > -1) {
        user.liked.splice(index, 1);
        await user.save();
        res.status(200).json({ message: "Product successfully unliked!" });
      }
    } else {
      user.liked.push(productId);
      await user.save();
      res.status(200).json({ message: "Product successfully liked!" });
    }
  } catch (error) {
    console.error("Error liking/unliking product:", error);
    res.status(500).json({ error: "Error liking/unliking product" });
  }
};

export const getSellers = async (req, res) => {
  try {
    const users = await userModel.find({ role: "seller" });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Error fetching users from the database" });
  }
};

export const getUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await userModel.findById(userId);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users from the database" });
  }
};
