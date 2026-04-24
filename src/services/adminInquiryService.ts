import { api } from "../utils/httputils";
import { API_ENDPOINTS } from "../utils/url";

export interface InquiryParams {
  id?: string;
  search?: string;
  count?: number;
  offset?: number;
  order_by?: string;
  order_dir?: "ASC" | "DESC";
}

export interface PaginatedInquiryResponse<T> {
  code: number;
  data: T[];
  count: number;
  totalcount: number;
}

export const adminInquiryService = {
  getContactInquiries: async (params: InquiryParams) => {
    const query = new URLSearchParams();
    if (params.id) query.append("id", params.id);
    if (params.search) query.append("search", params.search);
    query.append("count", (params.count || 10).toString());
    query.append("offset", (params.offset || 0).toString());
    query.append("order_by", params.order_by || "created_date");
    if (params.order_dir) query.append("order_dir", params.order_dir);

    return api.get(`${API_ENDPOINTS.ADMIN.INQUIRIES_CONTACT}?${query.toString()}`) as Promise<PaginatedInquiryResponse<any>>;
  },

  deleteContactInquiry: async (id: string) => {
    return api.delete(`${API_ENDPOINTS.ADMIN.INQUIRIES_CONTACT}/${id}`);
  },

  getProductOrders: async (params: InquiryParams) => {
    const query = new URLSearchParams();
    if (params.id) query.append("id", params.id);
    if (params.search) query.append("search", params.search);
    query.append("count", (params.count || 10).toString());
    query.append("offset", (params.offset || 0).toString());
    query.append("order_by", params.order_by || "created_date");
    if (params.order_dir) query.append("order_dir", params.order_dir);

    return api.get(`${API_ENDPOINTS.ADMIN.INQUIRIES_PRODUCT_ORDER}?${query.toString()}`) as Promise<PaginatedInquiryResponse<any>>;
  },

  deleteProductOrder: async (id: string) => {
    return api.delete(`${API_ENDPOINTS.ADMIN.INQUIRIES_PRODUCT_ORDER}/${id}`);
  },

  getSubscriptionInquiries: async (params: InquiryParams) => {
    const query = new URLSearchParams();
    if (params.id) query.append("id", params.id);
    if (params.search) query.append("search", params.search);
    query.append("count", (params.count || 10).toString());
    query.append("offset", (params.offset || 0).toString());
    query.append("order_by", params.order_by || "created_date");
    if (params.order_dir) query.append("order_dir", params.order_dir);

    return api.get(`${API_ENDPOINTS.ADMIN.INQUIRIES_SUBSCRIPTION}?${query.toString()}`) as Promise<PaginatedInquiryResponse<any>>;
  },

  deleteSubscriptionInquiry: async (id: string) => {
    return api.delete(`${API_ENDPOINTS.ADMIN.INQUIRIES_SUBSCRIPTION}/${id}`);
  },

  getExpiringMembers: async (params: InquiryParams) => {
    const query = new URLSearchParams();
    if (params.id) query.append("id", params.id);
    if (params.search) query.append("search", params.search);
    query.append("count", (params.count || 10).toString());
    query.append("offset", (params.offset || 0).toString());
    query.append("order_by", params.order_by || "created_date");
    if (params.order_dir) query.append("order_dir", params.order_dir);

    return api.get(`${API_ENDPOINTS.ADMIN.INQUIRIES_EXPIRING}?${query.toString()}`) as Promise<PaginatedInquiryResponse<any>>;
  },

  deleteExpiringMemberRecord: async (id: string) => {
    return api.delete(`${API_ENDPOINTS.ADMIN.INQUIRIES_EXPIRING}/${id}`);
  }
};
