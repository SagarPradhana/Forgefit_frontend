export const queryKeys = {
  admin: {
    users: (params: any) => ["admin", "users", params] as const,
    userDropdown: ["admin", "users", "dropdown"] as const,
    payments: (params: any) => ["admin", "payments", params] as const,
    products: (params: any) => ["admin", "products", params] as const,
    subscriptions: (params: any) => ["admin", "subscriptions", params] as const,
    inquiries: (tab: string, params: any) => ["admin", "inquiries", tab, params] as const,
    dashboard: {
      stats: (params: any) => ["admin", "dashboard", "stats", params] as const,
      revenueStats: (params: any) => ["admin", "dashboard", "revenue-stats", params] as const,
      monthlyRevenue: (params: any) => ["admin", "dashboard", "revenue", params] as const,
      recentInquiries: (params: any) => ["admin", "dashboard", "inquiries", params] as const,
      recentPayments: (params: any) => ["admin", "dashboard", "payments", params] as const,
      recentSubscriptions: (params: any) => ["admin", "dashboard", "subscriptions", params] as const,
      recentProducts: (params: any) => ["admin", "dashboard", "products", params] as const,
      attendance: (params: any) => ["admin", "dashboard", "attendance", params] as const,
    },
  }
};
