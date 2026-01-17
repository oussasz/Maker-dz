import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set) => ({
      cart: { totalAmount: 0, items: [] },
      setCart: (newCart) => set({ cart: newCart }),
      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== productId),
        })),
      updateItemQuantity: (itemId, newQuantity) =>
        set((state) => ({
          cart: {
            ...state.cart,
            items: state.cart.items.map((item) =>
              item._id === itemId ? { ...item, quantity: newQuantity } : item
            ),
          },
        })),
      clearCart: () => set({ cart: { totalAmount: 0, items: [] } }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        cart: state.cart,
      }),
    }
  )
);

export default useCartStore;
