import { api } from "../utils/httputils";
import { API_ENDPOINTS } from "../utils/url";

export interface ContactInquiryRequest {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface ProductOrderRequest {
  user_id: string;
  product_id: string;
  quantity: number;
  description: string;
}

export interface SubscriptionInquiryRequest {
  user_id: string;
  subscription_plan_id: string;
  description: string;
}

export interface ExpiringInquiryRequest {
  user_id: string;
  remaining_days: number;
}

export const appInquiryService = {
  createContactInquiry: async (data: ContactInquiryRequest) => {
    return api.post(API_ENDPOINTS.APP.INQUIRIES_CONTACT, data);
  },

  createProductOrder: async (data: ProductOrderRequest) => {
    return api.post(API_ENDPOINTS.APP.INQUIRIES_PRODUCT_ORDER, data);
  },

  createSubscriptionInquiry: async (data: SubscriptionInquiryRequest) => {
    return api.post(API_ENDPOINTS.APP.INQUIRIES_SUBSCRIPTION, data);
  },

  createExpiringInquiry: async (data: ExpiringInquiryRequest) => {
    return api.post(API_ENDPOINTS.APP.INQUIRIES_EXPIRING, data);
  },
};
