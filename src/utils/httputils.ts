import { useAuthStore } from "../store/authStore";
import { toast } from "../store/toastStore";
import { API_ENDPOINTS } from "./url";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface RequestOptions extends RequestInit {
  showToast?: boolean;
}

const pendingRequests = new Map<string, Promise<any>>();

export async function httpFetch(endpoint: string | null | undefined, options: RequestOptions = {}) {
  if (!endpoint) return null;
  
  const method = options.method || "GET";
  const cacheKey = `${method}:${endpoint}`;
  
  if (method === "GET" && pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey);
  }

  const requestPromise = (async () => {
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
    if (response.status === 401) {
      if (refreshToken) {
        try {
          const refreshRes = await fetch(`${BASE_URL}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token: refreshToken }),
          });

          if (refreshRes.ok) {
            const refreshData = await refreshRes.json();
            // Adjust response parsing based on common API wrapper patterns
            const newAccessToken = refreshData.data?.access_token || refreshData.access_token;
            const newRefreshToken = refreshData.data?.refresh_token || refreshData.refresh_token;
            
            if (newAccessToken) {
              updateTokens(newAccessToken, newRefreshToken || refreshToken);
              
              // Retry original request with New Token
              headers.set("Authorization", `Bearer ${newAccessToken}`);
              response = await fetch(`${BASE_URL}${endpoint}`, {
                ...fetchOptions,
                headers,
              });
            } else {
              throw new Error("Token refresh returned no data");
            }
          } else {
            logout();
            toast.error("Session expired. Please login again.");
            return null;
          }
        } catch (error) {
          logout();
          toast.error("Authentication failed. Redirecting to login.");
          return null;
        }
      } else {
        // No refresh token available, logout immediately
        logout();
        toast.error("Authentication expired.");
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
  })();

  if (method === "GET") {
    pendingRequests.set(cacheKey, requestPromise);
    requestPromise.finally(() => {
      pendingRequests.delete(cacheKey);
    });
  }

  return requestPromise;
}

export const api = {
  get: (url: string, params?: any, options?: RequestOptions) => {
    // Build query string from params
    let finalUrl = url;
    if (params && Object.keys(params).length > 0) {
      const queryString = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          queryString.append(key, String(value));
        }
      });
      const query = queryString.toString();
      if (query) {
        finalUrl = `${url}${url.includes("?") ? "&" : "?"}${query}`;
      }
    }
    return httpFetch(finalUrl, { ...options, method: "GET" });
  },
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
  download: async (url: string, filename: string) => {
    const { token } = useAuthStore.getState();
    const headers = new Headers();
    if (token) headers.set("Authorization", `Bearer ${token}`);

    const response = await fetch(`${BASE_URL}${url}`, { headers });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw errorData;
    }
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  },
};
