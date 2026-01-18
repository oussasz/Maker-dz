import { create } from "zustand";

const useWishlistStore = create((set, get) => ({
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
}));

export default useWishlistStore;
