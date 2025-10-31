import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosRequestConfig,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
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
  private refreshPromise: Promise<AxiosResponse> | null = null;
  private sessionExpired = false; // Flag to prevent cascading requests
  private refreshFailureCount = 0; // Track consecutive refresh failures
  private readonly MAX_REFRESH_RETRIES = 2; // Maximum refresh attempts before auto-logout

  constructor() {
    const baseURL = this.getApiUrl();

    this.client = axios.create({
      baseURL,
      //timeout: 30000,
    });

    this.setupInterceptors();
  }

  private getApiUrl(): string {
    const apiUrl =
      process.env.EXPO_PUBLIC_API_URL ||
      'https://foodrush-be.onrender.com/api/v1';

    return apiUrl;
  }

  private setupInterceptors() {
    // Request interceptor - add auth token
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        // Immediately reject if session has expired
        if (this.sessionExpired) {
          throw this.createSessionExpiredError();
        }

        try {
          const token = await TokenManager.getToken();
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
            // Log API request details for debugging (without sensitive data)
            // API Request: method, url, hasAuth, contentType
          } else if (config.url && !config.url.includes('/auth/')) {
            // Warn if no token is available for protected routes
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
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as RetryableRequest;

        // Immediately reject if session has expired
        if (this.sessionExpired) {
          throw this.createSessionExpiredError();
        }

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

  private createSessionExpiredError(): ApiError {
    const error = new Error('Session expired. Please log in again.') as ApiError;
    error.code = 'SESSION_EXPIRED';
    error.status = 401;
    error.isApiError = true;
    return error;
  }

  private async handleTokenRefresh(
    originalRequest: RetryableRequest,
  ): Promise<AxiosResponse> {
    try {
      const refreshToken = await TokenManager.getRefreshToken();

      if (!refreshToken) {
        // No refresh token - immediately fail and logout
        this.refreshFailureCount++;
        console.warn(`⚠️ No refresh token available (Attempt ${this.refreshFailureCount}/${this.MAX_REFRESH_RETRIES})`);
        await this.handleRefreshFailure();
        throw this.createSessionExpiredError();
      }

      // Check if max retries exceeded
      if (this.refreshFailureCount >= this.MAX_REFRESH_RETRIES) {
        console.error(`❌ Max refresh retries (${this.MAX_REFRESH_RETRIES}) exceeded. Auto-logout initiated.`);
        await this.handleRefreshFailure();
        throw this.createSessionExpiredError();
      }

      if (this.isRefreshing && this.refreshPromise) {
        // Token refresh in progress, wait for it and retry
        try {
          await this.refreshPromise;
          const token = await TokenManager.getToken();
          if (token && originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return this.client(originalRequest);
        } catch (err) {
          throw err;
        }
      }

      originalRequest._retry = true;
      this.isRefreshing = true;

      // Create refresh promise for concurrent requests
      this.refreshPromise = (async () => {
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

        // Token refresh successful - reset failure count
        this.refreshFailureCount = 0;
        console.log('✅ Token refresh successful');
        await TokenManager.setTokens(accessToken, newRefreshToken);

        // Update original request
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        return this.client(originalRequest);
      })();

      return await this.refreshPromise;
    } catch (refreshError) {
      this.refreshFailureCount++;
      console.error(`❌ Token refresh failed (Attempt ${this.refreshFailureCount}/${this.MAX_REFRESH_RETRIES}):`, refreshError);
      
      // If max retries reached, handle refresh failure (logout)
      if (this.refreshFailureCount >= this.MAX_REFRESH_RETRIES) {
        console.error('❌ Max refresh retries exceeded. Logging out...');
        await this.handleRefreshFailure();
      }
      
      throw this.createSessionExpiredError();
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
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

  // Centralized refresh failure handler - clears everything and logs out
  private async handleRefreshFailure(): Promise<void> {
    // Set session expired flag to prevent new requests
    this.sessionExpired = true;

    // Clear tokens
    await TokenManager.clearAllTokens();

    // Clear all stores and trigger logout
    try {
      // Clear all stores before logout
      await this.clearAllStores();

      // Trigger logout
      const { useAuthStore } = await import('@/src/stores/AuthStore');
      const logout = useAuthStore.getState().logout;
      if (logout) {
        await logout();
      }
    } catch (error) {
      console.error('Error during refresh failure cleanup:', error);
    }
  }

  // Clear all application stores
  private async clearAllStores(): Promise<void> {
    try {
      // Clear cart store
      const { useCartStore } = await import('@/src/stores/customerStores/cartStore');
      useCartStore.getState().clearCart();

      // Clear notification store
      const { useNotificationStore } = await import('@/src/stores/shared/notificationStore');
      useNotificationStore.getState().reset();

      // Clear restaurant profile store
      const { useRestaurantProfileStore } = await import('@/src/stores/restaurantStores/restaurantProfileStore');
      useRestaurantProfileStore.getState().reset();

      // Clear address store
      const { useAddressStore } = await import('@/src/stores/customerStores/addressStore');
      useAddressStore.getState().clearAddresses();

      // Clear favorites store
      const { useRestaurantFavoritesStore } = await import('@/src/stores/shared/favorites/restaurantFavoritesStore');
      useRestaurantFavoritesStore.getState().clearFavorites();
    } catch (error) {
      console.error('Error clearing stores:', error);
    }
  }

  // Utility method to reset refresh state (useful for logout)
  public resetRefreshState(): void {
    this.isRefreshing = false;
    this.refreshPromise = null;
    this.sessionExpired = false;
    this.refreshFailureCount = 0; // Reset failure counter
  }

  // Method to update base URL if needed
  public updateBaseURL(newBaseURL: string): void {
    this.client.defaults.baseURL = newBaseURL;
  }

  // Get base URL for fetch requests
  public getBaseURL(): string {
    return this.client.defaults.baseURL || this.getApiUrl();
  }
}

export const apiClient = new ApiClient();
