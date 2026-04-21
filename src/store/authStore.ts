import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role } from "../data/mockData";

function parseJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

type AuthState = {
  role: Role | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  isAuthenticated: boolean;
  token: string | null;
  refreshToken: string | null;
  login: (accessToken: string, refreshToken: string) => void;
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
      login: (accessToken, refreshToken) => {
        const userData = parseJwt(accessToken);
        if (!userData) return;

        set({
          role: userData.role as Role,
          name: userData.name,
          email: userData.email,
          phone: userData.mobile,
          isAuthenticated: true,
          token: accessToken,
          refreshToken: refreshToken,
        });
      },
      updateTokens: (token, refreshToken) => set({ token, refreshToken }),
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
    }
  )
);
