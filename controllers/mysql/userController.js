import {
  User,
  Product,
  SellerProfile,
  Address,
} from "../../models/mysql/index.js";

export const getUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Remove password from response
    const { password, ...userData } = user;
    res.status(200).json(userData);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Error fetching user from the database" });
  }
};

export const getSellers = async (req, res) => {
  try {
    const sellers = await User.findByRole("seller");

    // Get seller profiles for each seller
    const sellersWithProfiles = await Promise.all(
      sellers.map(async (seller) => {
        const profile = await SellerProfile.findByUserId(seller.id);
        const { password, ...sellerData } = seller;
        return { ...sellerData, profile };
      }),
    );

    res.status(200).json(sellersWithProfiles);
  } catch (error) {
    console.error("Error fetching sellers:", error);
    res.status(500).json({ error: "Error fetching sellers from the database" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Verify user is updating their own profile
    if (req.user.id !== parseInt(userId) && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "You can only update your own profile" });
    }

    const { username, email, phone, profile, firstName, lastName, avatar } =
      req.body;
    const updates = {};

    if (username) updates.username = username;
    if (email) updates.email = email;
    const profileUpdates =
      profile && typeof profile === "object" ? { ...profile } : {};
    if (firstName !== undefined) profileUpdates.firstName = firstName;
    if (lastName !== undefined) profileUpdates.lastName = lastName;
    if (phone !== undefined) profileUpdates.phone = phone;
    if (avatar !== undefined) profileUpdates.avatar = avatar;

    if (Object.keys(profileUpdates).length > 0) {
      updates.profile = profileUpdates;
    }

    const success = await User.updateById(userId, updates);
    if (!success) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = await User.findById(userId);
    const { password, ...userData } = user;

    res.status(200).json({
      message: "User updated successfully",
      user: userData,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Error updating user" });
  }
};

export const likeProduct = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { productId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let liked = JSON.parse(user.liked || "[]");
    const isLiked = liked.includes(productId);

    if (isLiked) {
      liked = liked.filter((id) => id !== productId);
      await User.updateById(userId, { liked: JSON.stringify(liked) });
      res.status(200).json({ message: "Product successfully unliked!" });
    } else {
      liked.push(productId);
      await User.updateById(userId, { liked: JSON.stringify(liked) });
      res.status(200).json({ message: "Product successfully liked!" });
    }
  } catch (error) {
    console.error("Error liking/unliking product:", error);
    res.status(500).json({ error: "Error liking/unliking product" });
  }
};

// Address management
export const getAddresses = async (req, res) => {
  try {
    const userId = req.user.id;
    const addresses = await Address.findByUserId(userId);
    res.status(200).json({ addresses });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ error: "Error fetching addresses" });
  }
};

export const addAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { label, fullName, phone, wilaya, commune, address, isDefault } =
      req.body;

    const addressId = await Address.create({
      user_id: userId,
      label,
      full_name: fullName,
      phone,
      wilaya,
      commune,
      address,
      is_default: isDefault || false,
    });

    if (isDefault) {
      await Address.setDefault(userId, addressId);
    }

    const newAddress = await Address.findById(addressId);
    res.status(201).json({ message: "Address added", address: newAddress });
  } catch (error) {
    console.error("Error adding address:", error);
    res.status(500).json({ error: "Error adding address" });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;
    const { label, fullName, phone, wilaya, commune, address, isDefault } =
      req.body;

    const updates = {};
    if (label) updates.label = label;
    if (fullName) updates.full_name = fullName;
    if (phone) updates.phone = phone;
    if (wilaya) updates.wilaya = wilaya;
    if (commune) updates.commune = commune;
    if (address) updates.address = address;

    await Address.updateById(addressId, updates);

    if (isDefault) {
      await Address.setDefault(userId, addressId);
    }

    const updatedAddress = await Address.findById(addressId);
    res
      .status(200)
      .json({ message: "Address updated", address: updatedAddress });
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ error: "Error updating address" });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    await Address.deleteById(addressId);
    res.status(200).json({ message: "Address deleted" });
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({ error: "Error deleting address" });
  }
};

// Seller profile
export const getSellerProfile = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const profile = await SellerProfile.findByUserId(sellerId);

    if (!profile) {
      return res.status(200).json({ profile: null });
    }

    res.status(200).json({ profile });
  } catch (error) {
    console.error("Error fetching seller profile:", error);
    res.status(500).json({ error: "Error fetching seller profile" });
  }
};

export const updateSellerProfile = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const { shopName, shopDescription, shopLogo, shopBanner } = req.body;

    let profile = await SellerProfile.findByUserId(sellerId);

    if (!profile) {
      if (!shopName) {
        return res
          .status(400)
          .json({ error: "Shop name is required to create profile" });
      }
      // Create new profile
      await SellerProfile.create({
        userId: sellerId,
        shopName,
        shopDescription,
        shopLogo,
        shopBanner,
      });
    } else {
      // Update existing profile
      const updates = {};
      if (shopName !== undefined) updates.shopName = shopName;
      if (shopDescription !== undefined)
        updates.shopDescription = shopDescription;
      if (shopLogo !== undefined) updates.shopLogo = shopLogo;
      if (shopBanner !== undefined) updates.shopBanner = shopBanner;

      await SellerProfile.updateByUserId(sellerId, updates);
    }

    profile = await SellerProfile.findByUserId(sellerId);
    res.status(200).json({ message: "Profile updated", profile });
  } catch (error) {
    console.error("Error updating seller profile:", error);
    res.status(500).json({ error: "Error updating seller profile" });
  }
};
