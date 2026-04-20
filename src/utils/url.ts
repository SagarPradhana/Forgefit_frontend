export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REFRESH_TOKEN: "/api/auth/refresh-token",
    LOGOUT: "/api/auth/logout",
  },
  USER: {
    PROFILE: "/api/user/profile",
    UPDATE: "/api/user/update",
  },
  ADMIN: {
    USERS: "/api/admin/users",
    PLANS: "/api/admin/plans",
    PAYMENTS: "/api/admin/payments",
  },
} as const;

export type ApiEndpoint = typeof API_ENDPOINTS;
