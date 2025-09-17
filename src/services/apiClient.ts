import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig, AxiosError } from 'axios';
import { Platform } from 'react-native';
import TokenManager, { UserType } from './tokenManager';

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

type LogoutCallback = () => Promise<void>;

class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: Array<{
    resolve: (token: string) => void;
    reject: (error: any) => void;
  }> = [];
  private logoutCallback: LogoutCallback | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.EXPO_PUBLIC_API_URL || 'https://foodrush-be.onrender.com/api/v1',
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  setLogoutCallback(callback: LogoutCallback) {
    this.logoutCallback = callback;
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      async (config) => {
        const authHeader = await TokenManager.getAuthHeader();
        if (authHeader) {
          config.headers.Authorization = authHeader;
        }
        
        config.headers['X-Device-Platform'] = Platform.OS;
        config.headers['X-App-Version'] = process.env.EXPO_PUBLIC_APP_VERSION || '1.0.0';
        
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        if (!error.response) {
          throw {
            message: 'Network error. Please check your connection.',
            code: 'NETWORK_ERROR',
          } as ApiError;
        }

        // Skip token refresh for auth endpoints
        const isAuthEndpoint = originalRequest.url?.includes('/auth/');

        // Handle 401 Unauthorized
        if (error.response.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
          const refreshToken = await TokenManager.getRefreshToken();
          
          if (!refreshToken) {
            await this.handleLogout();
            throw {
              message: 'Session expired. Please log in again.',
              code: 'SESSION_EXPIRED',
              status: 401,
            } as ApiError;
          }

          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.refreshSubscribers.push({ resolve, reject });
            }).then((token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return this.client(originalRequest);
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const response = await this.client.post('/auth/refresh-token', {
              refreshToken,
            });

            const { accessToken } = response.data;

            if (!accessToken) {
              throw new Error('No access token received');
            }

            await TokenManager.updateAccessToken(accessToken);
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;

            // Notify pending requests
            this.refreshSubscribers.forEach(({ resolve }) => resolve(accessToken));
            this.refreshSubscribers = [];

            return this.client(originalRequest);
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            
            this.refreshSubscribers.forEach(({ reject }) => reject(refreshError));
            this.refreshSubscribers = [];
            
            await this.handleLogout();
            
            throw {
              message: 'Session expired. Please log in again.',
              code: 'SESSION_EXPIRED',
            } as ApiError;
          } finally {
            this.isRefreshing = false;
          }
        }

        const apiError: ApiError = {
          message: (error.response?.data as any)?.message || error.message || 'An error occurred',
          status: error.response?.status,
          code: (error.response?.data as any)?.code || 'UNKNOWN_ERROR',
          details: (error.response?.data as any)?.details,
        };

        return Promise.reject(apiError);
      },
    );
  }

  private async handleLogout() {
    try {
      await TokenManager.clearTokens();
      if (this.logoutCallback) {
        await this.logoutCallback();
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  // HTTP methods
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config);
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config);
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data, config);
  }

  public async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.patch<T>(url, data, config);
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config);
  }
}

export const apiClient = new ApiClient();
