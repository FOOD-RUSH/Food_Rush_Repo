import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import RestaurantTokenManager from './tokenManager';

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  MAX_REQUESTS: 100, // Max requests per window
  WINDOW_MS: 60 * 1000, // 1 minute window
  RETRY_DELAY: 1000, // 1 second delay between retries
  MAX_RETRIES: 3,
};

// Request tracking for rate limiting
class RateLimiter {
  private requests: number[] = [];
  private blockedUntil: number = 0;

  canMakeRequest(): boolean {
    const now = Date.now();
    
    // Check if currently blocked
    if (now < this.blockedUntil) {
      return false;
    }
    
    // Clean old requests outside the window
    this.requests = this.requests.filter(time => now - time < RATE_LIMIT_CONFIG.WINDOW_MS);
    
    // Check if we're within the limit
    if (this.requests.length >= RATE_LIMIT_CONFIG.MAX_REQUESTS) {
      this.blockedUntil = now + RATE_LIMIT_CONFIG.WINDOW_MS;
      return false;
    }
    
    // Add current request
    this.requests.push(now);
    return true;
  }

  getTimeUntilReset(): number {
    const now = Date.now();
    return Math.max(0, this.blockedUntil - now);
  }
}

// Enhanced error interface
interface EnhancedApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
  retryAfter?: number;
  isRateLimited?: boolean;
}

class RestaurantApiClient {
  private client: AxiosInstance;
  private rateLimiter: RateLimiter;
  private isRefreshing: boolean = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  constructor() {
    this.rateLimiter = new RateLimiter();
    
    this.client = axios.create({
      baseURL: process.env.EXPO_PUBLIC_API_URL || 'https://foodrush-be.onrender.com/api/v1',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Type': 'restaurant-mobile',
        'X-Client-Version': '1.0.0',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      async (config) => {
        // Check rate limiting
        if (!this.rateLimiter.canMakeRequest()) {
          const timeUntilReset = this.rateLimiter.getTimeUntilReset();
          throw {
            message: 'Rate limit exceeded. Please try again later.',
            code: 'RATE_LIMIT_EXCEEDED',
            retryAfter: timeUntilReset,
            isRateLimited: true,
          } as EnhancedApiError;
        }

        // Add authentication header
        const token = await RestaurantTokenManager.getAuthHeader();
        if (token) {
          config.headers.Authorization = token;
        }

        // Add request timestamp for security
        config.headers['X-Request-Timestamp'] = Date.now().toString();
        
        // Add request ID for tracking
        config.headers['X-Request-ID'] = this.generateRequestId();

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        // Handle rate limiting
        if (error.response?.status === 429) {
          const retryAfter = error.response.headers['retry-after'];
          const enhancedError: EnhancedApiError = {
            message: 'Too many requests. Please try again later.',
            status: 429,
            code: 'RATE_LIMIT_EXCEEDED',
            retryAfter: retryAfter ? parseInt(retryAfter) * 1000 : RATE_LIMIT_CONFIG.WINDOW_MS,
            isRateLimited: true,
          };
          return Promise.reject(enhancedError);
        }

        // Handle token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = await RestaurantTokenManager.getRefreshToken();
            if (!refreshToken) {
              // No refresh token available, user needs to login again
              await RestaurantTokenManager.clearAllTokens();
              throw {
                message: 'Your session has expired. Please log in again to continue.',
                code: 'SESSION_EXPIRED',
                status: 401,
              } as EnhancedApiError;
            }

            const response = await this.client.post('/restaurants/auth/refresh-token', {
              refreshToken,
            });

            const { accessToken } = response.data;

            if (!accessToken) {
              throw new Error('No access token in refresh response');
            }

            // Store new token
            await RestaurantTokenManager.setToken(accessToken);

            // Update the authorization header
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;

            // Notify all waiting requests
            this.refreshSubscribers.forEach(callback => callback(accessToken));
            this.refreshSubscribers = [];

            return this.client(originalRequest);
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);

            // Clear subscribers
            this.refreshSubscribers = [];

            // Refresh failed, clear tokens
            await RestaurantTokenManager.clearAllTokens();

            throw {
              message: 'Your session has expired. Please log in again to continue.',
              code: 'SESSION_EXPIRED',
            } as EnhancedApiError;
          } finally {
            this.isRefreshing = false;
          }
        }

        // Handle other errors
        const enhancedError: EnhancedApiError = {
          message: (error.response?.data as any)?.message || error.message || 'An error occurred',
          status: error.response?.status,
          code: (error.response?.data as any)?.code || 'UNKNOWN_ERROR',
          details: (error.response?.data as any)?.details,
        };

        return Promise.reject(enhancedError);
      }
    );
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Public methods
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config);
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config);
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data, config);
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config);
  }

  public async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.patch<T>(url, data, config);
  }

  // Utility methods
  public getRateLimitStatus() {
    return {
      canMakeRequest: this.rateLimiter.canMakeRequest(),
      timeUntilReset: this.rateLimiter.getTimeUntilReset(),
      currentRequests: this.rateLimiter['requests'].length,
    };
  }

  public async validateToken(): Promise<boolean> {
    try {
      const token = await RestaurantTokenManager.getToken();
      if (!token) return false;

      // Make a lightweight request to validate token
      await this.client.get('/restaurants/auth/validate');
      return true;
    } catch (error) {
      return false;
    }
  }
}

// Export singleton instance
export const restaurantApiClient = new RestaurantApiClient();

// Export the class for testing purposes
export { RestaurantApiClient };
