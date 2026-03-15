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
   * For removing items (quantity=0) or instant updates
   */
  const updateCartInstant = useCallback(
    async ({ productId, variantId, quantity, personalization }) => {
      try {
        // If quantity is 0, use DELETE endpoint
        if (quantity <= 0) {
          const res = await axiosPrivate.delete("/cart/item", {
            params: { productId, variantId },
          });
          setCart(res.data.cart);
          return res.data;
        }

        // Otherwise use PUT with updates array format
        const res = await axiosPrivate.put("/cart", {
          updates: [{ productId, variantId, quantity, personalization }],
        });

        setCart(res.data.cart);
        return res.data;
      } catch (err) {
        console.error("Cart update failed:", err);
        toast.error("Failed to update cart");
        throw err;
      }
    },
    [setCart, axiosPrivate],
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
    [updateCartInstant],
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

    const itemId = item.id;
    const product = item.product || item.productId || {};
    const productId = product.id || item.productId;

    // Optimistic UI
    updateItemQuantity(itemId, newQuantity);

    // Debounced backend update
    await updateCartDebounced({
      itemId: itemId,
      productId: productId,
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
    const product = item.product || item.productId || {};
    const productId = product.id || item.productId;

    await updateCartInstant({
      productId: productId,
      variantId: item.variantId,
      quantity: 0,
    });

    toast.success("Item removed");
  };

  /**
   * Changing variant should also be INSTANT
   */
  const handleVariantChange = async (item, attributeName, newValue) => {
    const product = item.product || item.productId || {};
    const productId = product.id || item.productId;
    const variants = product.variants || [];

    const currentVariant = variants.find(
      (v) => v.id === item.variantId,
    );

    if (!currentVariant) {
      toast.error("Current variant not found");
      return;
    }

    const updatedAttributes = {
      ...currentVariant.attributes,
      [attributeName]: newValue,
    };

    const newVariant = variants.find((v) =>
      Object.entries(updatedAttributes).every(
        ([key, value]) => v.attributes[key] === value,
      ),
    );

    if (!newVariant) {
      toast.error("No variant found for selected attributes");
      return;
    }

    await updateCartInstant({
      productId: productId,
      variantId: newVariant.id,
      quantity: item.quantity,
    });

    toast.success("Variant updated");
  };

  const handlePersonalizationChange = async (item, newValue) => {
    const product = item.product || item.productId || {};
    const productId = product.id || item.productId;

    await updateCartInstant({
      productId: productId,
      variantId: item.variantId,
      personalization: newValue,
    });

    toast.success("Item updated");
  };

  // ------------------------------------------------------------------------------------

  return {
    handleIncrement,
    handleDecrement,
    handleVariantChange,
    handleItemRemove,
    handlePersonalizationChange,
  };
};

export default useCartActions;
