import { useState, useEffect, useCallback, useRef } from "react";
import { api } from "../utils/httputils";

interface UseGetOptions {
  enabled?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  useCache?: boolean;
}

const apiCache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useGet<T = any>(url: string | null | undefined, options: UseGetOptions = {}) {
  const { enabled = true, useCache = false } = options;
  
  const getCachedData = () => {
    if (useCache && url && apiCache[url]) {
      if (Date.now() - apiCache[url].timestamp < CACHE_DURATION) {
        return apiCache[url].data;
      }
    }
    return null;
  };

  const [data, setData] = useState<T | null>(getCachedData);
  const [loading, setLoading] = useState<boolean>(enabled && !getCachedData());
  const [error, setError] = useState<any>(null);

  // Use a ref for options to avoid infinite loops when anonymous functions are passed
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const fetchData = useCallback(async (ignoreCache = false) => {
    if (!ignoreCache && useCache && url) {
      const cached = getCachedData();
      if (cached) {
        setData(cached);
        setLoading(false);
        if (optionsRef.current.onSuccess) optionsRef.current.onSuccess(cached);
        return;
      }
    }

    setLoading(true);
    try {
      const result = await api.get(url);
      if (useCache && url) {
        apiCache[url] = { data: result, timestamp: Date.now() };
      }
      setData(result);
      if (optionsRef.current.onSuccess) optionsRef.current.onSuccess(result);
      setError(null);
    } catch (err: any) {
      setError(err);
      if (optionsRef.current.onError) optionsRef.current.onError(err);
    } finally {
      setLoading(false);
    }
  }, [url, useCache]);

  useEffect(() => {
    if (enabled && url) {
      fetchData();
    }
  }, [enabled, url, fetchData]);

  return { data, loading, error, refetch: () => fetchData(true) };
}

interface UseMutationOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export function useMutation<T = any>(
  method: "post" | "put" | "delete" | "patch" | "upload",
  options: UseMutationOptions = {}
) {
  const { onSuccess, onError } = options;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const mutate = async (url: string, body?: any) => {
    setLoading(true);
    try {
      const result = await (api as any)[method](url, body);
      if (onSuccess) onSuccess(result);
      setError(null);
      return result;
    } catch (err: any) {
      setError(err);
      if (onError) onError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}
