import { api } from "../utils/httputils";
import { API_ENDPOINTS } from "../utils/url";

export interface PlanRequest {
  name: string;
  description: string;
  price: number;
  duration_in_months: number;
}

export interface PlanResponse extends PlanRequest {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  status: string;
  status_code: number;
  message: string;
  data: T[];
  total_count: number;
  page_size: number;
  page_no: number;
  has_next: boolean;
  has_previous: boolean;
}

export const adminSubscriptionService = {
  getPlans: async (params: { page?: number; per_page?: number; search?: string }) => {
    const query = new URLSearchParams();
    if (params.page) query.append("page", params.page.toString());
    if (params.per_page) query.append("per_page", params.per_page.toString());
    if (params.search) query.append("search", params.search);

    const url = `${API_ENDPOINTS.ADMIN.PLANS}?${query.toString()}`;
    return api.get(url) as Promise<PaginatedResponse<PlanResponse>>;
  },

  createPlan: async (data: PlanRequest) => {
    return api.post(API_ENDPOINTS.ADMIN.PLANS, data) as Promise<{ data: PlanResponse; message: string }>;
  },

  updatePlan: async (id: string, data: Partial<PlanRequest>) => {
    return api.patch(API_ENDPOINTS.ADMIN.PLAN_DETAIL(id), data) as Promise<{ data: PlanResponse; message: string }>;
  },

  deletePlan: async (id: string) => {
    return api.delete(API_ENDPOINTS.ADMIN.PLAN_DETAIL(id)) as Promise<{ message: string }>;
  },
};
