"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useApi } from "@/hooks/use-api";

interface ApiDataState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

type QueryParams = Record<string, string | number | undefined>;

export function useApiData<T>(
  path: string,
  params?: QueryParams,
  initial?: T | null
): ApiDataState<T> {
  const { get } = useApi();
  const [data, setData] = useState<T | null>(initial ?? null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const latestParamsRef = useRef<QueryParams | undefined>(params);
  const isMountedRef = useRef(true);

  useEffect(() => {
    latestParamsRef.current = params;
  }, [params]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const queryKey = useMemo(
    () => JSON.stringify(params ?? {}),
    [params]
  );

  const fetchData = useCallback(async () => {
    if (!isMountedRef.current) {
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const response = await get<T>(
        path,
        latestParamsRef.current ?? undefined
      );
      if (!isMountedRef.current) {
        return;
      }
      setData(response);
    } catch (err) {
      if (!isMountedRef.current) {
        return;
      }
      const message =
        err instanceof Error ? err.message : "Failed to load data";
      setError(message);
      setData(null);
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [get, path, queryKey]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  };
}

