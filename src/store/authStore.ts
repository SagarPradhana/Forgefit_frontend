import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role } from "../data/mockData";

type AuthState = {
  role: Role | null;
  name: string | null;
  isAuthenticated: boolean;
  token: string | null;
  refreshToken: string | null;
  login: (role: Role, name: string, token: string, refreshToken: string) => void;
  updateTokens: (token: string, refreshToken: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      role: null,
      name: null,
      isAuthenticated: false,
      token: null,
      refreshToken: null,
      login: (role, name, token, refreshToken) =>
        set({ role, name, isAuthenticated: true, token, refreshToken }),
      updateTokens: (token, refreshToken) =>
        set({ token, refreshToken }),
      logout: () =>
        set({
          role: null,
          name: null,
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
