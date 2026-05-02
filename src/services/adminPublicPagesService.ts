import { api } from "../utils/httputils";
import { API_ENDPOINTS } from "../utils/url";

export interface FAQ {
  id?: string;
  question: string;
  answer: string;
  created_date?: number;
}

export interface Testimonial {
  id?: string;
  name: string;
  note: string;
  created_date?: number;
}

export type PublicBannerType = 
  | "common" 
  | "inspirational" 
  | "trainers" 
  | "offers" 
  | "about" 
  | "testimonials";

export interface PublicBanner {
  id: string;
  type: PublicBannerType;
  file_path: string;
  created_date: number;
  updated_date: number;
}

export interface BannerConfig {
  type: PublicBannerType;
  maxCount: number;
  maxSizeMB: number;
  allowedTypes: string[];
  label: string;
  icon: string;
}

export const adminPublicPagesService = {
  // FAQs
  getFAQs: async () => {
    return api.get(API_ENDPOINTS.PUBLIC.FAQ);
  },
  
  createFAQ: async (data: Omit<FAQ, "id" | "created_date">) => {
    return api.post(API_ENDPOINTS.PUBLIC.FAQ, data);
  },
  
  updateFAQ: async (id: string, data: Partial<Omit<FAQ, "id" | "created_date">>) => {
    return api.patch(API_ENDPOINTS.PUBLIC.FAQ_DETAIL(id), data);
  },
  
  deleteFAQ: async (id: string) => {
    return api.delete(API_ENDPOINTS.PUBLIC.FAQ_DETAIL(id));
  },

  // Testimonials
  getTestimonials: async () => {
    return api.get(API_ENDPOINTS.PUBLIC.TESTIMONIALS);
  },
  
  createTestimonial: async (data: Omit<Testimonial, "id" | "created_date">) => {
    return api.post(API_ENDPOINTS.PUBLIC.TESTIMONIAL, data);
  },
  
  updateTestimonial: async (id: string, data: Partial<Omit<Testimonial, "id" | "created_date">>) => {
    return api.patch(API_ENDPOINTS.PUBLIC.TESTIMONIAL_DETAIL(id), data);
  },
  
  deleteTestimonial: async (id: string) => {
    return api.delete(API_ENDPOINTS.PUBLIC.TESTIMONIAL_DETAIL(id));
  },

  // Public Banners
  uploadBanner: async (file: File, type: PublicBannerType) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    return api.upload(API_ENDPOINTS.PUBLIC.UPLOAD_BANNERS, formData);
  },

  getBannersByType: async (type: PublicBannerType) => {
    return api.get(API_ENDPOINTS.PUBLIC.BANNERS_DETAILS(type));
  },

  deleteBanner: async (id: string) => {
    return api.delete(API_ENDPOINTS.PUBLIC.BANNER_DELETE(id));
  }
};
