import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {
  clearUnauthorizedHandler,
  registerUnauthorizedHandler,
  setAccessToken,
} from '../api/client';
import { login as loginRequest, refreshSession } from '../api/auth';
import type { AuthResponse, LoginPayload } from '../api/auth';
import type { SessionUser } from '../types/domain';

interface AuthState {
  user?: SessionUser;
  accessToken?: string | null;
  refreshToken?: string | null;
  isInitialized: boolean;
}

interface AuthContextValue {
  user?: SessionUser;
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = import.meta.env.VITE_AUTH_STORAGE_KEY ?? 'victor_admin_session';

const persistSession = (data: AuthResponse) => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      user: data.user,
    }),
  );
};

const clearSession = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    isInitialized: false,
    user: undefined,
    accessToken: undefined,
    refreshToken: undefined,
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as AuthResponse;
        setState({
          user: parsed.user,
          accessToken: parsed.accessToken,
          refreshToken: parsed.refreshToken,
          isInitialized: true,
        });
        setAccessToken(parsed.accessToken);
      } catch {
        clearSession();
        setState((prev) => ({ ...prev, isInitialized: true }));
      }
    } else {
      setState((prev) => ({ ...prev, isInitialized: true }));
    }
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const response = await loginRequest(payload);
    setState({
      user: response.user,
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      isInitialized: true,
    });
    setAccessToken(response.accessToken);
    persistSession(response);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setAccessToken(null);
    setState({
      user: undefined,
      accessToken: null,
      refreshToken: null,
      isInitialized: true,
    });
  }, []);

  const refresh = useCallback(async () => {
    if (!state.refreshToken) {
      logout();
      return;
    }

    const response = await refreshSession({ refreshToken: state.refreshToken });
    persistSession({
      ...response,
      user: state.user as SessionUser,
    });
    setAccessToken(response.accessToken);
    setState((prev) => ({
      ...prev,
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    }));
  }, [logout, state.refreshToken, state.user]);

  useEffect(() => {
    const handler = () => {
      logout();
    };
    registerUnauthorizedHandler(handler);

    return () => {
      clearUnauthorizedHandler();
    };
  }, [logout]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: state.user,
      isAuthenticated: Boolean(state.user && state.accessToken),
      isInitialized: state.isInitialized,
      login,
      logout,
      refresh,
    }),
    [login, logout, refresh, state.accessToken, state.isInitialized, state.user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return ctx;
};

