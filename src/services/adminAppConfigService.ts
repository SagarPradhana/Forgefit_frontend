import { api } from "../utils/httputils";
import { API_ENDPOINTS } from "../utils/url";

export interface AppConfigData {
  id?: string;
  brand_name: string;
  logo_image_path?: string;
  gym_in_out_limit_in_hrs: number;
  theme_name: string;
  description: string;
  timezone: string;
  currency: string;
  language: string;
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
  expiry_reminder_days: number;
}

export interface AppConfigResponse extends Partial<AppConfigData> {
  code?: number;
  mCode?: string;
  message?: string;
  params?: any[];
  data?: AppConfigData[]; // fallback / legacy shape
}

export const adminAppConfigService = {
  getConfig: async (): Promise<AppConfigResponse> => {
    return api.get(API_ENDPOINTS.ADMIN.APP_CONFIG) as Promise<AppConfigResponse>;
  },

  saveConfig: async (payload: Omit<AppConfigData, "id" | "logo_image_path">): Promise<any> => {
    return api.post(API_ENDPOINTS.ADMIN.APP_CONFIG, payload, { showToast: false });
  },

  uploadLogo: async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append("file", file);
    return api.upload(API_ENDPOINTS.ADMIN.APP_CONFIG_UPLOAD, formData, { showToast: false });
  },

  getLanguages: async (): Promise<any> => {
    return api.get(API_ENDPOINTS.APP.LANGUAGES, { showToast: false });
  },

  getTimezones: async (search?: string): Promise<any> => {
    const url = search ? `${API_ENDPOINTS.APP.TIMEZONES}?search=${search}` : API_ENDPOINTS.APP.TIMEZONES;
    return api.get(url, { showToast: false });
  },
};
