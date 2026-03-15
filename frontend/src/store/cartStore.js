import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import useAuth from "./authStore";

const getCartStorageKey = () => {
  const userId = useAuth.getState().user?.id;
  return `cart-storage-${userId ?? "guest"}`;
};

const userScopedStorage = {
  getItem: (name) => localStorage.getItem(getCartStorageKey()) ?? null,
  setItem: (name, value) => localStorage.setItem(getCartStorageKey(), value),
  removeItem: (name) => localStorage.removeItem(getCartStorageKey()),
};

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
              item.id === itemId ? { ...item, quantity: newQuantity } : item,
            ),
          },
        })),
      clearCart: () => set({ cart: { totalAmount: 0, items: [] } }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => userScopedStorage),
      partialize: (state) => ({
        cart: state.cart,
      }),
    },
  ),
);

let currentUserKey = useAuth.getState().user?.id ?? "guest";
useAuth.subscribe(
  (state) => state.user?.id ?? "guest",
  (nextUserKey) => {
    if (nextUserKey !== currentUserKey) {
      currentUserKey = nextUserKey;
      useCartStore.setState({ cart: { totalAmount: 0, items: [] } });
      useCartStore.persist.rehydrate();
    }
  },
);

export default useCartStore;
