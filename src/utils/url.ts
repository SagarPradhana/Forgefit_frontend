export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REFRESH_TOKEN: "/api/auth/refresh-token",
    LOGOUT: "/api/auth/logout",
  },
  USER: {
    PROFILE: "/api/user/profile",
    UPDATE: "/api/user/update",
    DETAIL: (id: string) => `/api/user/${id}`,
    RESET_PASSWORD: (id: string) => `/api/user/${id}/reset-password`,
    DOWNLOAD_IDCARD: (id: string) => `/api/user/${id}/download-idcard`,
  },
  ADMIN: {
    USERS: "/api/admin/user_roles/users",
    TRAINER_LIST: "/api/admin/user_roles/trainer_list",
    USER_CREATE: "/api/admin/user_roles/users/create",
    USER_EDIT: (id: string) => `/api/admin/user_roles/users/${id}/edit`,
    USER_UPLOAD: (id: string) => `/api/admin/user_roles/users/${id}/upload_file`,
    USER_DOC_DELETE: (id: string) => `/api/admin/user_roles/users/${id}/docs`,
    USER_STATUS: (id: string) => `/api/admin/user_roles/users/${id}/status`,
    USER_DELETE: (id: string) => `/api/admin/user_roles/users/${id}`,
    ROLES: "/api/admin/user_roles/roles",
    PLANS: "/api/admin/subscription/subscription-plans",
    PLAN_DETAIL: (id: string) => `/api/admin/subscription/subscription-plans/${id}`,
    SUBSCRIPTION_HISTORY: "/api/admin/subscription/subscription-history",
    SUBSCRIPTION_CREATE: "/api/admin/user_roles/subscription-plan-create",
    PRODUCTS: "/api/admin/product/",
    PRODUCT_DETAIL: (id: string) => `/api/admin/product/${id}`,
    PAYMENTS: "/api/admin/payment/",
    PAYMENT_DETAIL: (id: string) => `/api/admin/payment/${id}`,
    SYNC_SUBSCRIPTIONS: "/api/admin/user_roles/sync-users-subscription-plans",
    ATTENDANCE: "/api/admin/attendance/",
    ATTENDANCE_STATS: "/api/admin/attendance/attendance-stats",
    ATTENDANCE_USER: (userId: string) => `/api/admin/attendance/${userId}`,
    ATTENDANCE_DETAIL: (id: string) => `/api/admin/attendance/${id}`,
  }
} as const;

export type ApiEndpoint = typeof API_ENDPOINTS;
