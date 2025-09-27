import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosRequestConfig,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import { Platform } from 'react-native';
import TokenManager from './tokenManager';
import { getUserFriendlyErrorMessage } from '../../utils/errorHandler';

export interface ApiError extends Error {
  message: string;
  status?: number;
  code?: string;
  isApiError: true;
}

interface RetryableRequest extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface RefreshTokenResponse {
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  constructor() {
    const baseURL = this.getApiUrl();

    this.client = axios.create({
      baseURL,
      timeout: 30000,
    });

    this.setupInterceptors();
  }

  private getApiUrl(): string {
    const apiUrl =
      process.env.EXPO_PUBLIC_API_URL ||
      'https://foodrush-be.onrender.com/api/v1';

    // Handle Android emulator localhost
    if (Platform.OS === 'android' && apiUrl.includes('localhost')) {
      return apiUrl.replace('localhost', '10.0.2.2');
    }

    return apiUrl;
  }

  private setupInterceptors() {
    // Request interceptor - add auth token
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        try {
          const token = await TokenManager.getToken();
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
            // Log API request details for debugging (without sensitive data)
            const isFormData = config.data instanceof FormData;
            // API Request: method, url, hasAuth, contentType
          } else if (config.url && !config.url.includes('/auth/')) {
            // Warn if no token is available for protected routes
            console.warn(
              '⚠️ No auth token available for protected route:',
              config.url,
            );
          }
          return config;
        } catch (error) {
          console.error('❌ Error getting token for request:', error);
          return config;
        }
      },
      (error) => {
        console.error('❌ Request interceptor error:', error);
        return Promise.reject(error);
      },
    );

    // Response interceptor - handle errors and token refresh
    this.client.interceptors.response.use(
      (response) => {
        // Log successful API responses for debugging
        // API Response: status, url, method
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as RetryableRequest;

        // Log API errors for debugging
        console.error('❌ API Error:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: originalRequest?.url,
          method: originalRequest?.method?.toUpperCase(),
          code: error.code,
        });

        // Handle network errors
        if (!error.response) {
          throw this.createNetworkError(error);
        }

        // Handle 401 - token refresh
        if (
          error.response.status === 401 &&
          originalRequest &&
          !originalRequest._retry
        ) {
          return this.handleTokenRefresh(originalRequest);
        }

        // Handle other errors
        throw this.createApiError(error);
      },
    );
  }

  private createNetworkError(error: AxiosError): ApiError {
    let message: string;
    let code: string;

    // Log error for debugging
    console.error('🚨 Network Error:', {
      code: error.code,
      message: error.message,
      url: `${error.config?.baseURL}${error.config?.url}`,
      method: error.config?.method?.toUpperCase(),
    });

    switch (error.code) {
      case 'ECONNABORTED':
        message = 'Request timed out. Please try again.';
        code = 'TIMEOUT';
        break;
      case 'ECONNREFUSED':
        message = 'Cannot connect to server. Please check your connection.';
        code = 'CONNECTION_REFUSED';
        break;
      case 'ENOTFOUND':
        message = 'Server not found. Please check your connection.';
        code = 'SERVER_NOT_FOUND';
        break;
      case 'ENETUNREACH':
        message = 'Network unreachable. Please check your connection.';
        code = 'NETWORK_UNREACHABLE';
        break;
      default:
        message = 'Network error. Please check your connection.';
        code = 'NETWORK_ERROR';
    }

    const apiError = new Error(message) as ApiError;
    apiError.code = code;
    apiError.isApiError = true;
    return apiError;
  }

  private createApiError(error: AxiosError): ApiError {
    const status = error.response?.status;
    const data = error.response?.data as any;

    const apiError = new Error(getUserFriendlyErrorMessage(error)) as ApiError;
    apiError.status = status;
    apiError.code = data?.code || data?.error?.code || `HTTP_${status}`;
    apiError.isApiError = true;

    return apiError;
  }

  private async handleTokenRefresh(
    originalRequest: RetryableRequest,
  ): Promise<AxiosResponse> {
    try {
      const refreshToken = await TokenManager.getRefreshToken();

      // Attempting token refresh for request: originalRequest.url

      if (!refreshToken) {
        console.warn('⚠️ No refresh token available, logging out');
        await TokenManager.clearAllTokens();
        // Trigger full logout when no refresh token
        this.triggerLogout();
        const error = new Error('Please log in again.') as ApiError;
        error.code = 'UNAUTHENTICATED';
        error.status = 401;
        error.isApiError = true;
        throw error;
      }

      if (this.isRefreshing) {
        // Token refresh in progress, queuing request
        return new Promise((resolve, reject) => {
          this.refreshSubscribers.push((token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(this.client(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      this.isRefreshing = true;

      const response = await axios.post<RefreshTokenResponse['data']>(
        `${this.client.defaults.baseURL}/auth/refresh-token`,
        { refresh_token: refreshToken },
        { timeout: 10000 },
      );

      const { accessToken, refreshToken: newRefreshToken } = response.data;

      if (!accessToken || !newRefreshToken) {
        console.error('❌ Invalid refresh token response:', {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!newRefreshToken,
        });
        throw new Error('Invalid refresh token response');
      }

      // Token refresh successful
      await TokenManager.setTokens(accessToken, newRefreshToken);

      // Update original request
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      }

      // Notify waiting requests
      this.refreshSubscribers.forEach((callback) => callback(accessToken));
      this.refreshSubscribers = [];

      return this.client(originalRequest);
    } catch (refreshError) {
      console.error('❌ Token refresh failed:', refreshError);
      await TokenManager.clearAllTokens();
      this.refreshSubscribers = [];

      // Trigger full logout when refresh fails
      this.triggerLogout();

      const error = new Error(
        'Session expired. Please log in again.',
      ) as ApiError;
      error.code = 'SESSION_EXPIRED';
      error.status = 401;
      error.isApiError = true;
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  // Helper method to check if error is from API
  public isApiError(error: any): error is ApiError {
    return error && typeof error === 'object' && error.isApiError === true;
  }

  // HTTP Methods with better error handling
  async get<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    try {
      return await this.client.get<T>(url, config);
    } catch (error) {
      if (this.isApiError(error)) {
        throw error;
      }
      throw this.createNetworkError(error as AxiosError);
    }
  }

  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    try {
      // Handle FormData requests - don't set Content-Type, let axios handle it
      if (data instanceof FormData) {
        const formDataConfig = { ...config };
        if (formDataConfig.headers) {
          delete formDataConfig.headers['Content-Type']; // Let axios set the boundary
        }
        return await this.client.post<T>(url, data, formDataConfig);
      }

      return await this.client.post<T>(url, data, config);
    } catch (error) {
      if (this.isApiError(error)) {
        throw error;
      }
      throw this.createNetworkError(error as AxiosError);
    }
  }

  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    try {
      return await this.client.put<T>(url, data, config);
    } catch (error) {
      if (this.isApiError(error)) {
        throw error;
      }
      throw this.createNetworkError(error as AxiosError);
    }
  }

  async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    try {
      return await this.client.patch<T>(url, data, config);
    } catch (error) {
      if (this.isApiError(error)) {
        throw error;
      }
      throw this.createNetworkError(error as AxiosError);
    }
  }

  async delete<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    try {
      return await this.client.delete<T>(url, config);
    } catch (error) {
      if (this.isApiError(error)) {
        throw error;
      }
      throw this.createNetworkError(error as AxiosError);
    }
  }

  // Utility method to clear all pending refresh subscribers (useful for logout)
  public clearRefreshSubscribers(): void {
    this.refreshSubscribers = [];
    this.isRefreshing = false;
  }

  // Method to update base URL if needed
  public updateBaseURL(newBaseURL: string): void {
    this.client.defaults.baseURL = newBaseURL;
  }

  // Trigger full logout across the app
  private async triggerLogout(): Promise<void> {
    try {
      // Dynamically import the auth store to avoid circular dependencies
      const { useAuthStore } = await import('@/src/stores/AuthStore');
      if (useAuthStore) {
        const logout = useAuthStore.getState().logout;
        if (logout) {
          await logout();
        }
      }
    } catch (error) {
      console.error('Error triggering logout:', error);
      // Fallback: at least clear tokens
      await TokenManager.clearAllTokens();
    }
  }
}

export const apiClient = new ApiClient();
