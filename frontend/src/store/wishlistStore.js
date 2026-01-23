import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import useAuth from "./authStore";

const getWishlistStorageKey = () => {
  const userId = useAuth.getState().user?.id;
  return `wishlist-storage-${userId ?? "guest"}`;
};

const userScopedStorage = {
  getItem: (name) => localStorage.getItem(getWishlistStorageKey()) ?? null,
  setItem: (name, value) =>
    localStorage.setItem(getWishlistStorageKey(), value),
  removeItem: (name) => localStorage.removeItem(getWishlistStorageKey()),
};

const useWishlistStore = create(
  persist(
    (set, get) => ({
      wishlist: [],

      addToWishlist: (productId) =>
        set((state) => {
          const id = Number(productId);
          const currentWishlist = Array.isArray(state.wishlist)
            ? state.wishlist
            : [];
          // Avoid duplicates
          if (currentWishlist.some((wId) => Number(wId) === id)) {
            return state;
          }
          return { wishlist: [...currentWishlist, id] };
        }),

      removeFromWishlist: (productId) => {
        const id = Number(productId);
        set((state) => ({
          wishlist: Array.isArray(state.wishlist)
            ? state.wishlist.filter((wId) => Number(wId) !== id)
            : [],
        }));
      },

      clearWishlist: () => set({ wishlist: [] }),
      setWishlist: (newWishlist) =>
        set({
          wishlist: Array.isArray(newWishlist)
            ? newWishlist.map((id) => Number(id))
            : [],
        }),
      isInWishlist: (productId) => {
        const wishlist = get().wishlist;
        const id = Number(productId);
        return (
          Array.isArray(wishlist) && wishlist.some((wId) => Number(wId) === id)
        );
      },
    }),
    {
      name: "wishlist-storage",
      storage: createJSONStorage(() => userScopedStorage),
      partialize: (state) => ({ wishlist: state.wishlist }),
    },
  ),
);

let currentUserKey = useAuth.getState().user?.id ?? "guest";
useAuth.subscribe(
  (state) => state.user?.id ?? "guest",
  (nextUserKey) => {
    if (nextUserKey !== currentUserKey) {
      currentUserKey = nextUserKey;
      useWishlistStore.setState({ wishlist: [] });
      useWishlistStore.persist.rehydrate();
    }
  },
);

export default useWishlistStore;
