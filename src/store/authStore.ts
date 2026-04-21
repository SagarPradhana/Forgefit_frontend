import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role } from "../data/mockData";

type AuthState = {
  role: Role | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  isAuthenticated: boolean;
  token: string | null;
  refreshToken: string | null;
  login: (role: Role, name: string, email: string, phone: string, token: string, refreshToken: string) => void;
  updateTokens: (token: string, refreshToken: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      role: null,
      name: null,
      email: null,
      phone: null,
      isAuthenticated: false,
      token: null,
      refreshToken: null,
      login: (role, name, email, phone, token, refreshToken) =>
        set({ role, name, email, phone, isAuthenticated: true, token, refreshToken }),
      updateTokens: (token, refreshToken) =>
        set({ token, refreshToken }),
      logout: () =>
        set({
          role: null,
          name: null,
          email: null,
          phone: null,
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
