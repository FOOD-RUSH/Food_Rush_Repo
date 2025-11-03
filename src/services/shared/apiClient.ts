/**
 * API Client Service
 * 
 * Handles all HTTP requests with automatic token management and refresh.
 * Uses event-driven architecture for session management.
 * 
 * Responsibilities:
 * - HTTP request/response handling
 * - Token injection and refresh
 * - Error transformation
 * - Event emission for session state changes
 * 
 * Does NOT:
 * - Manage stores directly
 * - Handle logout logic
 * - Clear application state
 */

import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosRequestConfig,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import TokenManager from './tokenManager';
import { getUserFriendlyErrorMessage } from '../../utils/errorHandler';
import { eventBus } from './eventBus';

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
  private refreshPromise: Promise<string> | null = null;

  constructor() {
    const baseURL = this.getApiUrl();
    this.client = axios.create({ baseURL });
    this.setupInterceptors();
  }

  private getApiUrl(): string {
    return (
      process.env.EXPO_PUBLIC_API_URL ||
      'https://foodrush-be.onrender.com/api/v1'
    );
  }

  private setupInterceptors() {
    // Request interceptor - add auth token
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        try {
          const token = await TokenManager.getToken();
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          return config;
        } catch (error) {
          console.error('Error getting token for request:', error);
          return config;
        }
      },
      (error) => Promise.reject(error),
    );

    // Response interceptor - handle errors and token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as RetryableRequest;

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

  private async handleTokenRefresh(
    originalRequest: RetryableRequest,
  ): Promise<AxiosResponse> {
    // Check if this is an auth endpoint (login, register, etc.)
    const isAuthEndpoint = originalRequest.url?.includes('/auth/');
    if (isAuthEndpoint) {
      // Don't try to refresh for auth endpoints
      throw this.createApiError({
        response: { status: 401 },
      } as AxiosError);
    }

    try {
      const refreshToken = await TokenManager.getRefreshToken();

      if (!refreshToken) {
        // No refresh token - session expired
        this.handleSessionExpired();
        throw this.createSessionExpiredError();
      }

      // If already refreshing, wait for it
      if (this.isRefreshing && this.refreshPromise) {
        const newToken = await this.refreshPromise;
        originalRequest.headers!.Authorization = `Bearer ${newToken}`;
        return this.client(originalRequest);
      }

      // Start refresh
      originalRequest._retry = true;
      this.isRefreshing = true;

      this.refreshPromise = this.performTokenRefresh(refreshToken);
      const newToken = await this.refreshPromise;

      // Update request with new token
      originalRequest.headers!.Authorization = `Bearer ${newToken}`;

      // Emit event for successful refresh
      eventBus.emit('token-refreshed');

      return this.client(originalRequest);
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.handleSessionExpired();
      throw this.createSessionExpiredError();
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  private async performTokenRefresh(refreshToken: string): Promise<string> {
    const response = await axios.post<RefreshTokenResponse['data']>(
      `${this.client.defaults.baseURL}/auth/refresh-token`,
      { refresh_token: refreshToken },
      { timeout: 10000 },
    );

    const { accessToken, refreshToken: newRefreshToken } = response.data;

    if (!accessToken || !newRefreshToken) {
      throw new Error('Invalid refresh token response');
    }

    await TokenManager.setTokens(accessToken, newRefreshToken);
    return accessToken;
  }

  private handleSessionExpired(): void {
    // Clear tokens
    TokenManager.clearAllTokens().catch(console.error);

    // Emit event - let AuthStore handle the logout
    eventBus.emit('session-expired');
  }

  private createNetworkError(error: AxiosError): ApiError {
    let message: string;
    let code: string;

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

  // Helper method to check if error is from API
  public isApiError(error: any): error is ApiError {
    return error && typeof error === 'object' && error.isApiError === true;
  }

  // HTTP Methods
  async get<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config);
  }

  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    // Handle FormData - let axios set Content-Type with boundary
    if (data instanceof FormData && config?.headers) {
      delete config.headers['Content-Type'];
    }
    return this.client.post<T>(url, data, config);
  }

  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data, config);
  }

  async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.client.patch<T>(url, data, config);
  }

  async delete<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config);
  }

  // Utility methods
  public getBaseURL(): string {
    return this.client.defaults.baseURL || this.getApiUrl();
  }

  public updateBaseURL(newBaseURL: string): void {
    this.client.defaults.baseURL = newBaseURL;
  }
}

export const apiClient = new ApiClient();
