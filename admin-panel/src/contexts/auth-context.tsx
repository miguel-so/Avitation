/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { getApiBaseUrl } from "@/lib/env";
import type { VictorUser } from "@/types/api";

interface SessionState {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  issuedAt: number;
  user: VictorUser;
}

interface AuthContextValue {
  session: SessionState | null;
  isLoading: boolean;
  login: (payload: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<SessionState | null>;
  fetchWithAuth: <T>(
    input: RequestInfo | URL,
    init?: RequestInit
  ) => Promise<T>;
}

const STORAGE_KEY = "victor-session";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const apiBaseUrl = getApiBaseUrl();

const readStoredSession = (): SessionState | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as SessionState;
    return parsed;
  } catch (error) {
    console.warn("Failed to parse stored session", error);
    return null;
  }
};

const persistSession = (session: SessionState | null) => {
  if (typeof window === "undefined") {
    return;
  }

  if (session) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } else {
    window.localStorage.removeItem(STORAGE_KEY);
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [session, setSession] = useState<SessionState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = readStoredSession();
    if (stored) {
      setSession(stored);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      const response = await fetch(`${apiBaseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        const message =
          errorBody?.message ?? "Unable to authenticate. Please try again.";
        throw new Error(message);
      }

      const payload = (await response.json()) as any;
      const nextSession: SessionState = {
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken,
        tokenType: payload.tokenType ?? "Bearer",
        expiresIn: payload.expiresIn,
        issuedAt: Date.now(),
        user: payload.user,
      };

      setSession(nextSession);
      persistSession(nextSession);
      router.push("/dashboard");
    },
    [router]
  );

  const logout = useCallback(async () => {
    const refreshToken = session?.refreshToken;
    if (refreshToken) {
      await fetch(`${apiBaseUrl}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      }).catch(() => null);
    }

    setSession(null);
    persistSession(null);
    router.push("/signin");
  }, [router, session?.refreshToken]);

  const refresh = useCallback(async () => {
    if (!session) {
      return null;
    }

    const response = await fetch(`${apiBaseUrl}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken: session.refreshToken }),
    });

    if (!response.ok) {
      await logout();
      return null;
    }

    const payload = (await response.json()) as any;
    const nextSession: SessionState = {
      ...session,
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken,
      expiresIn: payload.expiresIn,
      issuedAt: Date.now(),
    };

    setSession(nextSession);
    persistSession(nextSession);
    return nextSession;
  }, [logout, session]);

  const fetchWithAuth = useCallback(
    async <T,>(input: RequestInfo | URL, init: RequestInit = {}) => {
      if (!session) {
        throw new Error("Not authenticated");
      }

      const headers = new Headers(init.headers as HeadersInit);
      headers.set(
        "Authorization",
        `${session.tokenType ?? "Bearer"} ${session.accessToken}`
      );

      if (init.method && init.method.toUpperCase() !== "GET") {
        if (!headers.has("Content-Type")) {
          headers.set("Content-Type", "application/json");
        }
      }

      const execute = async () =>
        fetch(input, {
          ...init,
          headers,
        });

      let response = await execute();

      if (response.status === 401) {
        const refreshed = await refresh();
        if (!refreshed) {
          throw new Error("Session expired");
        }
        headers.set(
          "Authorization",
          `${refreshed.tokenType ?? "Bearer"} ${refreshed.accessToken}`
        );
        response = await execute();
      }

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        const message =
          body?.message ?? `Request failed with status ${response.status}`;
        throw new Error(message);
      }

      return (await response.json()) as T;
    },
    [refresh, session]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isLoading,
      login,
      logout,
      refresh,
      fetchWithAuth,
    }),
    [fetchWithAuth, isLoading, login, logout, refresh, session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

