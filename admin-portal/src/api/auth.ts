import type { ApiResponse } from '../types/api';
import type { SessionUser } from '../types/domain';
import { http } from './client';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: SessionUser;
}

export interface RefreshPayload {
  refreshToken: string;
}

export const login = async (payload: LoginPayload) => {
  const { data } = await http.post<ApiResponse<AuthResponse>>('/auth/login', payload);
  return data.data;
};

export const refreshSession = async (payload: RefreshPayload) => {
  const { data } = await http.post<ApiResponse<Omit<AuthResponse, 'user'>>>(
    '/auth/refresh',
    payload,
  );
  return data.data;
};

