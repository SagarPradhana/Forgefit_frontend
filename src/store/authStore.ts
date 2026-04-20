import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role } from "../data/mockData";

type AuthState = {
  role: Role | null;
  isAuthenticated: boolean;
  token: string | null;
  refreshToken: string | null;
  login: (role: Role, token: string, refreshToken: string) => void;
  updateTokens: (token: string, refreshToken: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      role: null,
      isAuthenticated: false,
      token: null,
      refreshToken: null,
      login: (role, token, refreshToken) =>
        set({ role, isAuthenticated: true, token, refreshToken }),
      updateTokens: (token, refreshToken) =>
        set({ token, refreshToken }),
      logout: () =>
        set({
          role: null,
          isAuthenticated: false,
          token: null,
          refreshToken: null,
        }),
    }),
    {
      name: "auth-storage",
    },
  ),
);
