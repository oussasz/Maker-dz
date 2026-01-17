import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios.js";
import useCartStore from "../../store/cartStore";
import useWishlistStore from "../../store/wishlistStore";
import useAuth from "../../store/authStore.js";
import { toast } from "sonner";
import useAxiosPrivate from "../useAxiosPrivate.js";

const useProductActions = (
  product,
  selectedVariant,
  selectedAttributes,
  currentPrice,
  personalization,
  quantity
) => {
  const [buyNowOpen, setBuyNowOpen] = useState(false);
  const { setCart } = useCartStore();
  const { addToWishlist, isInWishlist, removeFromWishlist } =
    useWishlistStore();
  const axiosPrivate = useAxiosPrivate();
  const { user, isAuthenticated } = useAuth();
  const userId = user?.id;
  const navigate = useNavigate();

  const handleWishlist = (e) => {
    if (e) e.stopPropagation();
    if (!product) return;

    // Check authentication for wishlist
    if (!isAuthenticated) {
      toast.error("Please login to add items to wishlist");
      navigate("/login");
      return;
    }

    isInWishlist(product._id)
      ? removeFromWishlist(product._id)
      : addToWishlist(product._id);
  };

  const handleAddToCart = async (quantity) => {
    // Check authentication before adding to cart
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }

    if (!selectedVariant) {
      toast.error("Please select a variant");
      return;
    }
    try {
      const response = await axiosPrivate.post("/cart/add", {
        item: {
          productId: product._id,
          variantId: selectedVariant._id,
          personalization,
          quantity,
          price: currentPrice,
        },
      });

      console.log("new Cart: ", response.data.cart);
      toast.success("Product is Added to Cart");

      setCart(response.data.cart);
    } catch (error) {
      toast.error("Error adding product to cart");
      console.error("Failed to add product to cart", error);
    }
  };

  const handleBuyNow = async (shippingAddress) => {
    // Check authentication before buying
    if (!isAuthenticated) {
      toast.error("Please login to purchase");
      navigate("/login");
      return;
    }

    if (!product || !selectedVariant) return;

    try {
      const total = quantity * currentPrice;

      const orderData = {
        items: [
          {
            productId: product._id,
            sellerId: product.sellerId,
            variantId: selectedVariant._id,
            personalization,
            name: product.name,
            quantity,
            price: currentPrice,
            subtotal: quantity * currentPrice,
          },
        ],
        shippingAddress,
        subtotal: total,
        total,
      };

      const response = await axiosPrivate.post("/orders", orderData);

      if (response.status === 201) {
        toast.success("Your order is placed");
      } else {
        toast.error("There was an error placing your order. Please try again");
      }
    } catch (err) {
      toast.error("There was an error placing your order. Please try again");
      console.error("Error placing order:", err);
    }
  };

  return {
    buyNowOpen,
    setBuyNowOpen,
    handleWishlist,
    handleAddToCart,
    handleBuyNow,
    isInWishlist: product ? isInWishlist(product._id) : false,
    userId,
    isAuthenticated,
  };
};

export default useProductActions;
