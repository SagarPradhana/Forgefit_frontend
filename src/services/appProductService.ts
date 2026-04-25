import { api } from "../utils/httputils";
import { API_ENDPOINTS } from "../utils/url";

export interface AppProductResponse {
  id: string;
  name: string;
  category: string;
  price: number;
  stock_count: number;
  unit: string;
  image_url: string;
  description: string;
  is_deleted: boolean;
  created_date: number;
  updated_date: number;
}

export interface PaginatedAppProductResponse {
  count: number;
  totalcount: number;
  data: AppProductResponse[];
}

export const appProductService = {
  getProducts: async (params: {
    id?: string;
    search?: string;
    category?: string;
    is_deleted?: boolean;
    count?: number;
    offset?: number;
    order_by?: string;
    order_dir?: "ASC" | "DESC";
  }) => {
    const query = new URLSearchParams();
    if (params.id) query.append("id", params.id);
    if (params.search) query.append("search", params.search);
    if (params.category) query.append("category", params.category);
    if (params.is_deleted !== undefined) query.append("is_deleted", params.is_deleted.toString());
    if (params.count) query.append("count", params.count.toString());
    if (params.offset !== undefined) query.append("offset", params.offset.toString());
    if (params.order_by) query.append("order_by", params.order_by);
    if (params.order_dir) query.append("order_dir", params.order_dir);

    const url = `${API_ENDPOINTS.APP.PRODUCTS}?${query.toString()}`;
    return api.get(url) as Promise<PaginatedAppProductResponse>;
  },
};
