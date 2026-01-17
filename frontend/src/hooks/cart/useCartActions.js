import { useRef, useCallback } from "react";
import axios from "../../api/axios.js";
import useCartStore from "../../store/cartStore.js";
import { toast } from "sonner";
import useAxiosPrivate from "../useAxiosPrivate.js";

const useCartActions = () => {
  const { setCart, updateItemQuantity } = useCartStore();
  const axiosPrivate = useAxiosPrivate();
  const timeoutRefs = useRef({});

  /**
   * DIRECT server update (no debounce)
   */
  const updateCartInstant = useCallback(
    async ({ productId, variantId, quantity, personalization }) => {
      try {
        const res = await axiosPrivate.put("/cart/item/update", {
          productId,
          variantId,
          quantity,
          personalization,
        });

        setCart(res.data.cart);
        return res.data;
      } catch (err) {
        console.error("Cart update failed:", err);
        toast.error("Failed to update cart");
        throw err;
      }
    },
    [setCart, axiosPrivate]
  );

  /**
   * DEBOUNCED server update for quantity only
   */
  const updateCartDebounced = useCallback(
    ({ itemId, productId, variantId, quantity, personalization }) => {
      // Clear previous debounce
      if (timeoutRefs.current[itemId]) {
        clearTimeout(timeoutRefs.current[itemId]);
      }

      // Return a promise so caller can await
      return new Promise((resolve, reject) => {
        timeoutRefs.current[itemId] = setTimeout(async () => {
          try {
            const data = await updateCartInstant({
              productId,
              variantId,
              quantity,
              personalization,
            });

            toast.success("Cart updated");
            resolve(data);
          } catch (err) {
            reject(err);
          } finally {
            delete timeoutRefs.current[itemId];
          }
        }, 600); // debounce duration
      });
    },
    [updateCartInstant]
  );

  // ------------------------------------------------------------------------------------
  // ACTIONS
  // ------------------------------------------------------------------------------------

  /**
   * Main quantity change handler
   */
  const handleQuantityChange = async (item, newQuantity) => {
    if (newQuantity <= 0) {
      toast.warning("Quantity must be greater than 0");
      return;
    }

    // Optimistic UI
    updateItemQuantity(item._id, newQuantity);

    // Debounced backend update
    await updateCartDebounced({
      itemId: item._id,
      productId: item.productId._id,
      variantId: item.variantId,
      quantity: newQuantity,
    });
  };

  const handleIncrement = (item) => {
    handleQuantityChange(item, item.quantity + 1);
  };

  const handleDecrement = (item) => {
    if (item.quantity > 1) {
      handleQuantityChange(item, item.quantity - 1);
    }
  };

  /**
   * Removing an item should be INSTANT, not debounced
   */
  const handleItemRemove = async (item) => {
    await updateCartInstant({
      productId: item.productId._id,
      variantId: item.variantId,
      quantity: 0,
    });

    toast.success("Item removed");
  };

  /**
   * Changing variant should also be INSTANT
   */
  const handleVariantChange = async (item, attributeName, newValue) => {
    const currentVariant = item.productId.variants.find(
      (v) => v._id === item.variantId
    );

    const updatedAttributes = {
      ...currentVariant.attributes,
      [attributeName]: newValue,
    };

    const newVariant = item.productId.variants.find((v) =>
      Object.entries(updatedAttributes).every(
        ([key, value]) => v.attributes[key] === value
      )
    );

    if (!newVariant) {
      toast.error("No variant found for selected attributes");
      return;
    }

    await updateCartInstant({
      productId: item.productId._id,
      variantId: newVariant._id,
      quantity: item.quantity,
    });

    toast.success("Variant updated");
  };


  const handlePersonalizationChange = async (item, newValue) => {
    await updateCartInstant({
      productId: item.productId._id,
      variantId: item.variantId,
      personalization: newValue,
    });

    toast.success("Item updated");
  }

  // ------------------------------------------------------------------------------------

  return {
    handleIncrement,
    handleDecrement,
    handleVariantChange,
    handleItemRemove,
    handlePersonalizationChange
  };
};

export default useCartActions;
