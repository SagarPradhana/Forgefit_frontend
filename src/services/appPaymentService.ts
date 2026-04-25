import { api } from "../utils/httputils";
import { API_ENDPOINTS } from "../utils/url";

export type PaymentMethod = "cash" | "card" | "upi" | "other";
export type PaymentStatus = "paid" | "pending" | "failed";
export type PurchaseType = "subscription" | "renewal" | "product" | "other";

export interface AppPaymentResponse {
  id: string;
  user_id: string;
  name: string;
  username: string;
  mobile: string;
  email: string;
  amount: number;
  payment_date: number;
  payment_method: string;
  status: string;
  purchase_type: string;
  purchase_id: string;
  purchase_details: Record<string, any>;
  created_date: number;
  updated_date: number;
}

export interface PaginatedAppPaymentResponse {
  count: number;
  totalcount: number;
  data: AppPaymentResponse[];
}

export const appPaymentService = {
  getPayments: async (params: {
    user_id: string;
    id?: string;
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

    const url = `${API_ENDPOINTS.APP.PAYMENTS(params.user_id)}?${query.toString()}`;
    return api.get(url) as Promise<PaginatedAppPaymentResponse>;
  },
};
