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
    USERS: "/api/admin/user_roles/users",
    USER_CREATE: "/api/admin/user_roles/users/create",
    USER_EDIT: (id: string) => `/api/admin/user_roles/users/${id}/edit`,
    USER_UPLOAD: (id: string) => `/api/admin/user_roles/users/${id}/upload_file`,
    ROLES: "/api/admin/user_roles/roles",
    PLANS: "/api/admin/plans",
    PAYMENTS: "/api/admin/payments",
  },
} as const;

export type ApiEndpoint = typeof API_ENDPOINTS;
