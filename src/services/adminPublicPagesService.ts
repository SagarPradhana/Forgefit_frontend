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
  }
};
