"use client";

import { useCallback, useEffect, useState } from "react";
import { useApi } from "@/hooks/use-api";

interface ApiDataState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useApiData<T>(
  path: string,
  params?: Record<string, string | number | undefined>,
  initial?: T | null
): ApiDataState<T> {
  const api = useApi();
  const [data, setData] = useState<T | null>(initial ?? null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get<T>(path, params);
      setData(response);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load data";
      setError(message);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [api, params, path]);

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      fetchData();
    }
    return () => {
      isMounted = false;
    };
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  };
}

