import { useState, useEffect, useCallback, useRef } from "react";
import { api } from "../utils/httputils";

interface UseGetOptions {
  enabled?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export function useGet<T = any>(url: string | null | undefined, options: UseGetOptions = {}) {
  const { enabled = true } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<any>(null);

  // Use a ref for options to avoid infinite loops when anonymous functions are passed
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await api.get(url);
      setData(result);
      if (optionsRef.current.onSuccess) optionsRef.current.onSuccess(result);
      setError(null);
    } catch (err: any) {
      setError(err);
      if (optionsRef.current.onError) optionsRef.current.onError(err);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (enabled && url) {
      fetchData();
    }
  }, [enabled, url, fetchData]);

  return { data, loading, error, refetch: fetchData };
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
