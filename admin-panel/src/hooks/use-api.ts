"use client";

import { useCallback } from "react";
import { useAuth } from "@/contexts/auth-context";
import { getApiBaseUrl } from "@/lib/env";

const apiBaseUrl = getApiBaseUrl();

const buildQuery = (params?: Record<string, string | number | undefined>) => {
  if (!params) return "";
  const query = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
    )
    .join("&");
  return query ? `?${query}` : "";
};

export function useApi() {
  const { fetchWithAuth } = useAuth();

  const get = useCallback(
    async <T,>(
      path: string,
      params?: Record<string, string | number | undefined>
    ) => {
      const response = await fetchWithAuth<T>(
        `${apiBaseUrl}${path}${buildQuery(params)}`
      );
      return response;
    },
    [fetchWithAuth]
  );

  const post = useCallback(
    async <T,>(path: string, body?: unknown) => {
      const response = await fetchWithAuth<T>(`${apiBaseUrl}${path}`, {
        method: "POST",
        body: body ? JSON.stringify(body) : undefined,
      });
      return response;
    },
    [fetchWithAuth]
  );

  const put = useCallback(
    async <T,>(path: string, body?: unknown) => {
      const response = await fetchWithAuth<T>(`${apiBaseUrl}${path}`, {
        method: "PUT",
        body: body ? JSON.stringify(body) : undefined,
      });
      return response;
    },
    [fetchWithAuth]
  );

  const del = useCallback(
    async (path: string) => {
      await fetchWithAuth<void>(`${apiBaseUrl}${path}`, { method: "DELETE" });
    },
    [fetchWithAuth]
  );

  return { get, post, put, del };
}

