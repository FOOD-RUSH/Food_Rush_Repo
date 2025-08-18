import axios, { AxiosInstance } from 'axios';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Centralized Axios instance configured with base URL and auth header.
 */
const resolveBaseUrl = (): string => {
  const extra: any = (Constants as any)?.expoConfig?.extra || (Constants as any)?.manifest?.extra || {};
  const url = extra?.API_BASE_URL;
  if (!url) {
    console.warn('[services/http] Missing API_BASE_URL in app.json -> expo.extra');
  }
  return url || '';
};

export const api: AxiosInstance = axios.create({
  baseURL: resolveBaseUrl(),
  timeout: 15000,
  headers: {
    Accept: 'application/json',
  },
});

// Attach Authorization header if token exists in AsyncStorage
api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      config.headers = config.headers || {};
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    // noop
  }
  return config;
});

// Optional: unwrap common API error shape
api.interceptors.response.use(
  (res) => res,
  (error) => {
    // Keep original error but normalize message if provided by backend
    const backendMessage = error?.response?.data?.message || error?.response?.data?.error;
    if (backendMessage) {
      error.message = backendMessage;
    }
    return Promise.reject(error);
  }
);

export default api;


