import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosRequestConfig,
  AxiosError,
} from 'axios';
import { Platform } from 'react-native';
import TokenManager from './tokenManager';
import { User } from '../../types';
// Define error types
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

// Define refresh token response type
interface RefreshTokenResponse {
  status_code: number;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: User;
  };
}

class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];
  
  constructor() {
    this.client = axios.create({
      baseURL:
        process.env.EXPO_PUBLIC_API_URL ||
        'https://foodrush-be.onrender.com/api/v1',
      timeout: 30000, // Increased timeout for production
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
      },
      // Security headers
      withCredentials: false,
      maxRedirects: 0,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      async (config) => {
        const token = await TokenManager.getToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        // Add security and tracking headers
        config.headers['X-Device-Platform'] = Platform.OS;
        config.headers['X-App-Version'] =
          process.env.EXPO_PUBLIC_APP_VERSION || '1.0.0';
        
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Response interceptor with improved token refresh logic
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        // Handle network errors
        if (!error.response) {
          throw {
            message: 'Network error. Please check your connection.',
            code: 'NETWORK_ERROR',
          } as ApiError;
        }

        // Skip token refresh for auth endpoints (login, register, etc.)
        const isAuthEndpoint =
          originalRequest.url?.includes('/auth/') ||
          originalRequest.url?.includes('/login') ||
          originalRequest.url?.includes('/register');

        // Handle 401 Unauthorized errors (token refresh)
        if (
          error.response.status === 401 &&
          !originalRequest._retry &&
          !isAuthEndpoint
        ) {
          // Check if we have a refresh token before attempting refresh
          const refreshToken = await TokenManager.getRefreshToken();
          if (!refreshToken) {
            // No refresh token available, user needs to login again
            await TokenManager.clearAllTokens();

            throw {
              message: 'Please log in again.',
              code: 'UNAUTHENTICATED',
              status: 401,
            } as ApiError;
          }

          if (this.isRefreshing) {
            // If already refreshing, wait for the refresh to complete
            return new Promise((resolve) => {
              this.refreshSubscribers.push((token: string) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                resolve(this.client(originalRequest));
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            // Create a new axios instance for refresh to avoid interceptors
            const refreshResponse = await axios.post<RefreshTokenResponse>(
              `${this.client.defaults.baseURL}/auth/refresh-token`,
              { refresh_token: refreshToken},
              {
                timeout: 10000,
                headers: {
                  'Content-Type': 'application/json',
                  'X-Device-Platform': Platform.OS,
                },
              }
            );

            // Extract data from the correct response format
            const responseData = refreshResponse.data;
            if (!responseData.data || responseData.status_code !== 201) {
              throw new Error('Invalid refresh response format');
            }

            const { accessToken, refreshToken: newRefreshToken, user } = responseData.data;

            if (!accessToken || !newRefreshToken) {
              throw new Error('Missing tokens in refresh response');
            }

            // Store both tokens
            await TokenManager.setTokens(accessToken, newRefreshToken);

            // Update user data in auth store (lazy import to avoid circular dependency)
            try {
              const { useAuthStore } = await import('../../stores/customerStores/AuthStore');
              const authStore = useAuthStore.getState();
              authStore.setUser(user);
              authStore.setIsAuthenticated(true);
            } catch (storeError) {
              console.warn('Failed to update auth store after token refresh:', storeError);
              // Continue with the request even if store update fails
            }

            // Update the authorization header
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;

            // Notify all waiting requests
            this.refreshSubscribers.forEach((callback) =>
              callback(accessToken),
            );
            this.refreshSubscribers = [];

            return this.client(originalRequest);
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);

            // Clear subscribers
            this.refreshSubscribers = [];

            // Refresh failed, logout user
            await TokenManager.clearAllTokens();
            throw {
              message: 'Session expired. Please log in again.',
              code: 'SESSION_EXPIRED',
            } as ApiError;
          } finally {
            this.isRefreshing = false;
          }
        }

        // Handle other errors - preserve original error for auth endpoints
        const apiError: ApiError = {
          message:
            (error.response?.data as any)?.message ||
            error.message ||
            'An error occurred',
          status: error.response?.status,
          code: (error.response?.data as any)?.code || 'UNKNOWN_ERROR',
          details: (error.response?.data as any)?.details,
        };

        return Promise.reject(apiError);
      },
    );
  }

  public async get<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    try {
      return await this.client.get<T>(url, config);
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  public async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    try {
      return await this.client.post<T>(url, data, config);
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  public async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    try {
      return await this.client.put<T>(url, data, config);
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  public async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    try {
      return await this.client.patch<T>(url, data, config);
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  public async delete<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    try {
      return await this.client.delete<T>(url, config);
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  private handleApiError(error: any): ApiError {
    if (error.isAxiosError) {
      return {
        message:
          error.response?.data?.message || error.message || 'An error occurred',
        status: error.response?.status,
        code: error.code,
        details: error.response?.data,
      };
    }
    return error;
  }
}

export const apiClient = new ApiClient();