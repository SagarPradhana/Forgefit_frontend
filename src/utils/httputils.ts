import { useAuthStore } from "../store/authStore";
import { toast } from "../store/toastStore";
import { API_ENDPOINTS } from "./url";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface RequestOptions extends RequestInit {
  showToast?: boolean;
}

export async function httpFetch(endpoint: string | null | undefined, options: RequestOptions = {}) {
  if (!endpoint) return null;
  const { showToast = true, ...fetchOptions } = options;
  const { token, refreshToken, updateTokens, logout } = useAuthStore.getState();

  const isFormData = fetchOptions.body instanceof FormData;

  const headers = new Headers(fetchOptions.headers);
  if (token && endpoint !== API_ENDPOINTS.AUTH.LOGIN) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (!headers.has("Content-Type") && !isFormData) {
    headers.set("Content-Type", "application/json");
  }

  let response;
  try {
    response = await fetch(`${BASE_URL}${endpoint}`, {
      ...fetchOptions,
      headers,
    });
  } catch (err) {
    if (showToast) toast.error("Network connection error");
    throw err;
  }

  // Handle Token Expiry (401)
  if (response.status === 401 && refreshToken) {
    try {
      const refreshRes = await fetch(`${BASE_URL}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (refreshRes.ok) {
        const refreshData = await refreshRes.json();
        const { access_token, refresh_token } = refreshData.data;
        updateTokens(access_token, refresh_token);

        // Retry original request
        headers.set("Authorization", `Bearer ${access_token}`);
        response = await fetch(`${BASE_URL}${endpoint}`, {
          ...fetchOptions,
          headers,
        });
      } else {
        logout();
        toast.error("Session expired. Please login again.");
        return null;
      }
    } catch (error) {
      logout();
      return null;
    }
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (showToast) {
      const errorMessage = data?.message || data?.error || data?.errors?.[0]?.msg || "Something went wrong";
      toast.error(errorMessage);
    }
    throw data;
  }

  if (showToast && fetchOptions.method && fetchOptions.method !== "GET") {
    toast.success(data?.message || "Operation successful");
  }

  return data;
}

export const api = {
  get: (url: string, options?: RequestOptions) =>
    httpFetch(url, { ...options, method: "GET" }),
  post: (url: string, body: any, options?: RequestOptions) =>
    httpFetch(url, { ...options, method: "POST", body: JSON.stringify(body) }),
  put: (url: string, body: any, options?: RequestOptions) =>
    httpFetch(url, { ...options, method: "PUT", body: JSON.stringify(body) }),
  delete: (url: string, options?: RequestOptions) =>
    httpFetch(url, { ...options, method: "DELETE" }),
  patch: (url: string, body: any, options?: RequestOptions) =>
    httpFetch(url, { ...options, method: "PATCH", body: JSON.stringify(body) }),
  upload: (url: string, formData: FormData, options?: RequestOptions) =>
    httpFetch(url, { ...options, method: "POST", body: formData }),
};
