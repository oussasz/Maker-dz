import { create } from "zustand";

const useWishlistStore = create((set, get) => ({
  wishlist: [],

  addToWishlist: (productId) =>
    set((state) => ({
      wishlist: [...state.wishlist, productId],
    })),

  removeFromWishlist: (productId) => {
    set((state) => ({
      wishlist: state.wishlist.filter((id) => id !== productId),
    }));
  },

  clearWishlist: () => set({ wishlist: [] }),
  setWishlist: (newWishlist) => set({ wishlist: newWishlist }),
  isInWishlist: (productId) => get().wishlist.includes(productId),
}));

export default useWishlistStore;
