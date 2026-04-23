import { api } from "../utils/httputils";
import { API_ENDPOINTS } from "../utils/url";

export interface ProductRequest {
  name: string;
  category: string;
  price: number;
  stock_count: number;
  unit?: string;
  image_url?: string;
  description?: string;
}

export interface ProductResponse extends ProductRequest {
  id: string;
  is_deleted: boolean;
  created_date: number;
  updated_date: number;
}

export interface PaginatedProductResponse {
  code: number;
  mCode: string;
  message: string;
  count: number;
  totalcount: number;
  data: ProductResponse[];
}

export interface CommonProductResponse {
  code: number;
  mCode: string;
  message: string;
  data: any[];
}

export const adminProductService = {
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

    const url = `${API_ENDPOINTS.ADMIN.PRODUCTS}?${query.toString()}`;
    return api.get(url) as Promise<PaginatedProductResponse>;
  },

  createProduct: async (data: ProductRequest) => {
    return api.post(API_ENDPOINTS.ADMIN.PRODUCTS, data) as Promise<CommonProductResponse>;
  },

  updateProduct: async (id: string, data: Partial<ProductRequest>) => {
    return api.patch(API_ENDPOINTS.ADMIN.PRODUCT_DETAIL(id), data) as Promise<CommonProductResponse>;
  },

  deleteProduct: async (id: string) => {
    return api.delete(API_ENDPOINTS.ADMIN.PRODUCT_DETAIL(id)) as Promise<CommonProductResponse>;
  },
};
