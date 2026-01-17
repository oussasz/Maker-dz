import { useEffect } from "react";
import useCartStore from "../../store/cartStore.js";
import useAxiosPrivate from "../useAxiosPrivate.js";

const useCart = () => {
  const { setCart } = useCartStore();
  const axiosPrivate = useAxiosPrivate();

  const fetchCart = async () => {
    try {
      const res = await axiosPrivate.get(`/cart`);
      setCart(res.data.cart);
    } catch (error) {
      console.error("Failed to update cart", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return { fetchCart };
};

export default useCart;
