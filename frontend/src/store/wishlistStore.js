import { create } from "zustand";

const useWishlistStore = create((set, get) => ({
  wishlist: [],

  addToWishlist: (productId) =>
    set((state) => ({
      wishlist: Array.isArray(state.wishlist) ? [...state.wishlist, productId] : [productId],
    })),

  removeFromWishlist: (productId) => {
    set((state) => ({
      wishlist: Array.isArray(state.wishlist) ? state.wishlist.filter((id) => id !== productId) : [],
    }));
  },

  clearWishlist: () => set({ wishlist: [] }),
  setWishlist: (newWishlist) => set({ wishlist: Array.isArray(newWishlist) ? newWishlist : [] }),
  isInWishlist: (productId) => {
    const wishlist = get().wishlist;
    return Array.isArray(wishlist) && wishlist.includes(productId);
  },
}));

export default useWishlistStore;
