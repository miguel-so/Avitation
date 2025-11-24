import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api';

let accessToken: string | null = null;
let unauthorizedHandler: (() => void) | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const registerUnauthorizedHandler = (handler: () => void) => {
  unauthorizedHandler = handler;
};

export const clearUnauthorizedHandler = () => {
  unauthorizedHandler = null;
};

export const http = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

http.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${accessToken}`,
    };
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && unauthorizedHandler) {
      unauthorizedHandler();
    }
    return Promise.reject(error);
  },
);

