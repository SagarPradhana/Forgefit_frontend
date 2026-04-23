import { api } from "../utils/httputils";
import { API_ENDPOINTS } from "../utils/url";

export type PaymentMethod = "cash" | "card" | "upi" | "other";
export type PaymentStatus = "paid" | "pending" | "failed";
export type PurchaseType = "subscription" | "renewal" | "product" | "other";

export interface PaymentRequest {
  user_id: string;
  amount: number;
  payment_date: number;
  payment_method: PaymentMethod;
  status: PaymentStatus;
  purchase_type: PurchaseType;
  purchase_id: string;
  purchase_details?: any;
}

export interface PaymentResponse extends PaymentRequest {
  id: string;
  created_date: number;
  updated_date: number;
}

export interface PaginatedPaymentResponse {
  code: number;
  mCode: string;
  message: string;
  count: number;
  totalcount: number;
  data: PaymentResponse[];
}

export interface CommonPaymentResponse {
  code: number;
  mCode: string;
  message: string;
  data: any[];
}

export const adminPaymentService = {
  getPayments: async (params: {
    id?: string;
    user_id?: string;
    search?: string;
    amount?: number;
    from_date?: number;
    to_date?: number;
    payment_method?: PaymentMethod;
    status?: PaymentStatus;
    purchase_type?: PurchaseType;
    is_deleted?: boolean;
    count?: number;
    offset?: number;
    order_by?: string;
    order_dir?: "ASC" | "DESC";
  }) => {
    const query = new URLSearchParams();
    if (params.id) query.append("id", params.id);
    if (params.user_id) query.append("user_id", params.user_id);
    if (params.search) query.append("search", params.search);
    if (params.amount !== undefined) query.append("amount", params.amount.toString());
    if (params.from_date !== undefined) query.append("from_date", params.from_date.toString());
    if (params.to_date !== undefined) query.append("to_date", params.to_date.toString());
    if (params.payment_method) query.append("payment_method", params.payment_method);
    if (params.status) query.append("status", params.status);
    if (params.purchase_type) query.append("purchase_type", params.purchase_type);
    if (params.is_deleted !== undefined) query.append("is_deleted", params.is_deleted.toString());
    if (params.count) query.append("count", params.count.toString());
    if (params.offset !== undefined) query.append("offset", params.offset.toString());
    if (params.order_by) query.append("order_by", params.order_by);
    if (params.order_dir) query.append("order_dir", params.order_dir);

    const url = `${API_ENDPOINTS.ADMIN.PAYMENTS}?${query.toString()}`;
    return api.get(url) as Promise<PaginatedPaymentResponse>;
  },

  createPayment: async (data: PaymentRequest) => {
    return api.post(API_ENDPOINTS.ADMIN.PAYMENTS, data) as Promise<CommonPaymentResponse>;
  },

  updatePayment: async (id: string, data: Partial<PaymentRequest>) => {
    return api.patch(API_ENDPOINTS.ADMIN.PAYMENT_DETAIL(id), data) as Promise<CommonPaymentResponse>;
  },

  deletePayment: async (id: string) => {
    return api.delete(API_ENDPOINTS.ADMIN.PAYMENT_DETAIL(id)) as Promise<CommonPaymentResponse>;
  },
};
