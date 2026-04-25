import { api } from "../utils/httputils";
import { API_ENDPOINTS } from "../utils/url";

export interface AppSubscriptionPlanResponse {
  id: string;
  name: string;
  description: string;
  actual_price: number;
  price: number;
  duration_in_months: number;
  status: boolean;
  is_deleted: boolean;
  created_date: number;
  updated_date: number;
}

export interface PaginatedAppSubscriptionPlanResponse {
  count: number;
  totalcount: number;
  data: AppSubscriptionPlanResponse[];
}

export interface AppCurrentSubscriptionResponse {
  id: string;
  user_id: string;
  subscription_id: string;
  duration_in_months: number;
  amount: number;
  status: boolean;
  start_date: number;
  end_date: number;
  created_date: number;
  updated_date: number;
  subscription_name: string;
  subscription_price: number;
  subscription_duration_in_months: number;
}

export interface PaginatedAppCurrentSubscriptionResponse {
  count?: number;
  totalcount?: number;
  data?: AppCurrentSubscriptionResponse[];
  id?: string;
  user_id?: string;
  [key: string]: any; // Allow for other flattened properties
}

export interface AppSubscriptionHistoryResponse {
  id: string;
  user_id: string;
  subscription_id: string;
  duration_in_months: number;
  amount: number;
  status: boolean;
  start_date: number;
  end_date: number;
  created_date: number;
  updated_date: number;
}

export interface PaginatedAppSubscriptionHistoryResponse {
  count: number;
  totalcount: number;
  data: AppSubscriptionHistoryResponse[];
}

export const appSubscriptionService = {
  getSubscriptionPlans: async (params: {
    id?: string;
    search?: string;
    status?: boolean;
    is_deleted?: boolean;
    count?: number;
    offset?: number;
    order_by?: string;
    order_dir?: "ASC" | "DESC";
  }) => {
    const query = new URLSearchParams();
    if (params.id) query.append("id", params.id);
    if (params.search) query.append("search", params.search);
    if (params.status !== undefined) query.append("status", params.status.toString());
    if (params.is_deleted !== undefined) query.append("is_deleted", params.is_deleted.toString());
    if (params.count) query.append("count", params.count.toString());
    if (params.offset !== undefined) query.append("offset", params.offset.toString());
    if (params.order_by) query.append("order_by", params.order_by);
    if (params.order_dir) query.append("order_dir", params.order_dir);

    const url = `${API_ENDPOINTS.APP.SUBSCRIPTION_PLANS}?${query.toString()}`;
    return api.get(url) as Promise<PaginatedAppSubscriptionPlanResponse>;
  },

  getCurrentSubscription: async (userId: string) => {
    const url = API_ENDPOINTS.APP.CURRENT_SUBSCRIPTION(userId);
    return api.get(url) as Promise<PaginatedAppCurrentSubscriptionResponse>;
  },

  getSubscriptionHistory: async (userId: string, params: {
    subscription_id?: string;
    status?: string;
    start_date?: number;
    end_date?: number;
    search?: string;
    count?: number;
    offset?: number;
    order_by?: string;
    order_dir?: "ASC" | "DESC";
  }) => {
    const query = new URLSearchParams();
    if (params.subscription_id) query.append("subscription_id", params.subscription_id);
    if (params.status) query.append("status", params.status);
    if (params.start_date !== undefined) query.append("start_date", params.start_date.toString());
    if (params.end_date !== undefined) query.append("end_date", params.end_date.toString());
    if (params.search) query.append("search", params.search);
    if (params.count) query.append("count", params.count.toString());
    if (params.offset !== undefined) query.append("offset", params.offset.toString());
    if (params.order_by) query.append("order_by", params.order_by);
    if (params.order_dir) query.append("order_dir", params.order_dir);

    const url = `${API_ENDPOINTS.APP.SUBSCRIPTION_HISTORY(userId)}?${query.toString()}`;
    return api.get(url) as Promise<PaginatedAppSubscriptionHistoryResponse>;
  },
};
