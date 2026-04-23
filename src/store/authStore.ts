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
  id: string | null;
  role: Role | null;
  name: string | null;
  email: string | null;
  mobile: string | null;
  profile_image_path: string | null;
  metadata: any | null;
  isAuthenticated: boolean;
  token: string | null;
  refreshToken: string | null;
  login: (accessToken: string, refreshToken: string) => void;
  setUserData: (data: any) => void;
  updateTokens: (token: string, refreshToken: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      id: null,
      role: null,
      name: null,
      email: null,
      mobile: null,
      isAuthenticated: false,
      token: null,
      refreshToken: null,
      profile_image_path: null,
      metadata: null,
      login: (accessToken, refreshToken) => {
        const userData = parseJwt(accessToken);
        if (!userData) return;

        set({
          id: userData.id || userData.sub,
          role: userData.role as Role,
          name: userData.name,
          email: userData.email,
          mobile: userData.mobile,
          isAuthenticated: true,
          token: accessToken,
          refreshToken: refreshToken,
          profile_image_path: userData.profile_image_path || null,
          metadata: userData.metadata || null,
        });
      },
      setUserData: (data) => {
        set({
          name: data.name,
          email: data.email,
          mobile: data.mobile,
          profile_image_path: data.profile_image_path,
          metadata: data.metadata,
        });
      },
      updateTokens: (token, refreshToken) => set({ token, refreshToken }),
      logout: () =>
        set({
          id: null,
          role: null,
          name: null,
          email: null,
          mobile: null,
          profile_image_path: null,
          metadata: null,
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
