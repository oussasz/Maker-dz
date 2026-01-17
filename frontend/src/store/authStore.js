import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const useAuth = create(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,

      setIsAuthenticated: (status) => set({ isAuthenticated: status }),
      setUser: (user) => set({ user }),
      setAccessToken: (token) => set({ accessToken: token }),
      setRefreshToken: (token) => set({ refreshToken: token }),
      logout: () => {
        set({
          isAuthenticated: false,
          refreshToken: null,
          accessToken: null,
          user: null,
        });
        window.location.href = "/login"
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuth;
