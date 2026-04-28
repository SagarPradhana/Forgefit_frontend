import { api } from "../utils/httputils";
import { API_ENDPOINTS } from "../utils/url";

export interface LocationData {
  id?: string;
  latitude: number;
  longitude: number;
  radius: number;
  address: string;
  gym_open_status: boolean;
  working_hours_from_time: string;
  working_hours_to_time: string;
  country: string;
  email: string;
  phone: string;
  whatsapp: string;
  facebook_url: string;
  instagram_url: string;
  twitter_url: string;
  linkedin_url: string;
  tiktok_url: string;
  youtube_url: string;
  website_url: string;
  created_date?: number;
  updated_date?: number;
}

export interface LocationListResponse {
  count: number;
  totalcount: number;
  data: LocationData[];
}

export interface LocationParams {
  id?: string;
  search?: string;
  gym_open_status?: boolean;
  count?: number;
  offset?: number;
  order_by?: string;
  order_dir?: string;
}

export const adminLocationService = {
  getLocations: async (params: LocationParams = {}): Promise<LocationListResponse> => {
    const query = new URLSearchParams();
    if (params.id) query.append("id", params.id);
    if (params.search) query.append("search", params.search);
    if (params.gym_open_status !== undefined)
      query.append("gym_open_status", String(params.gym_open_status));
    query.append("count", String(params.count ?? 50));
    query.append("offset", String(params.offset ?? 0));
    if (params.order_by) query.append("order_by", params.order_by);
    if (params.order_dir) query.append("order_dir", params.order_dir);
    return api.get(`${API_ENDPOINTS.ADMIN.LOCATION}?${query.toString()}`, { showToast: false }) as Promise<LocationListResponse>;
  },

  createLocation: async (payload: Omit<LocationData, "id" | "created_date" | "updated_date">): Promise<any> => {
    return api.post(API_ENDPOINTS.ADMIN.LOCATION, payload, { showToast: false });
  },

  updateLocation: async (id: string, payload: Omit<LocationData, "id" | "created_date" | "updated_date">): Promise<any> => {
    return api.patch(API_ENDPOINTS.ADMIN.LOCATION_DETAIL(id), payload, { showToast: false });
  },

  deleteLocation: async (id: string): Promise<any> => {
    return api.delete(API_ENDPOINTS.ADMIN.LOCATION_DETAIL(id), { showToast: false });
  },
};
