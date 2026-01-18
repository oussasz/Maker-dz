import { useEffect } from "react";
import useCartStore from "../../store/cartStore.js";
import useAxiosPrivate from "../useAxiosPrivate.js";

const useCart = () => {
  const { setCart, cart } = useCartStore();
  const axiosPrivate = useAxiosPrivate();

  const fetchCart = async () => {
    try {
      // Add cache-busting parameter to prevent browser/CDN caching
      const res = await axiosPrivate.get(`/cart?_t=${Date.now()}`, {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
      });
      console.log("useCart fetch response:", res.data);
      console.log("Cart items count:", res.data.cart?.items?.length);
      setCart(res.data.cart);
    } catch (error) {
      console.error("Failed to update cart", error);
    }
  };

  useEffect(() => {
    console.log("useCart effect running, current cart:", cart);
    fetchCart();
  }, []);

  return { fetchCart };
};

export default useCart;
