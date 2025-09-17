import * as SecureStore from 'expo-secure-store';

// Optimized token manager with in-memory caching and batch operations
class OptimizedTokenManager {
  private static ACCESS_TOKEN_KEY = 'access_token';
  private static REFRESH_TOKEN_KEY = 'refresh_token';
  
  // In-memory cache for better performance
  private static accessTokenCache: string | null = null;
  private static refreshTokenCache: string | null = null;
  private static isInitialized = false;
  
  // Batch operations queue
  private static operationQueue: Promise<any> = Promise.resolve();

  // Initialize cache from secure storage
  static async initialize() {
    if (this.isInitialized) return;
    
    try {
      const [accessToken, refreshToken] = await Promise.all([
        SecureStore.getItemAsync(this.ACCESS_TOKEN_KEY),
        SecureStore.getItemAsync(this.REFRESH_TOKEN_KEY),
      ]);
      
      this.accessTokenCache = accessToken;
      this.refreshTokenCache = refreshToken;
      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing token manager:', error);
      this.isInitialized = true; // Mark as initialized even on error
    }
  }

  // Get access token (from cache if available)
  static async getToken(): Promise<string | null> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    return this.accessTokenCache;
  }

  // Get refresh token (from cache if available)
  static async getRefreshToken(): Promise<string | null> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    return this.refreshTokenCache;
  }

  // Set access token (update cache and storage)
  static async setToken(accessToken: string): Promise<boolean> {
    return this.queueOperation(async () => {
      try {
        this.accessTokenCache = accessToken;
        await SecureStore.setItemAsync(this.ACCESS_TOKEN_KEY, accessToken);
        return true;
      } catch (error) {
        console.error('Error storing access token:', error);
        return false;
      }
    });
  }

  // Set refresh token (update cache and storage)
  static async setRefreshToken(refreshToken: string): Promise<boolean> {
    return this.queueOperation(async () => {
      try {
        this.refreshTokenCache = refreshToken;
        await SecureStore.setItemAsync(this.REFRESH_TOKEN_KEY, refreshToken);
        return true;
      } catch (error) {
        console.error('Error storing refresh token:', error);
        return false;
      }
    });
  }

  // Set both tokens in a single batch operation
  static async setTokens(accessToken: string, refreshToken: string): Promise<boolean> {
    return this.queueOperation(async () => {
      try {
        // Update cache immediately
        this.accessTokenCache = accessToken;
        this.refreshTokenCache = refreshToken;
        
        // Batch storage operations
        await Promise.all([
          SecureStore.setItemAsync(this.ACCESS_TOKEN_KEY, accessToken),
          SecureStore.setItemAsync(this.REFRESH_TOKEN_KEY, refreshToken),
        ]);
        
        return true;
      } catch (error) {
        console.error('Error storing tokens:', error);
        return false;
      }
    });
  }

  // Clear all tokens
  static async clearAllTokens(): Promise<void> {
    return this.queueOperation(async () => {
      try {
        // Clear cache immediately
        this.accessTokenCache = null;
        this.refreshTokenCache = null;
        
        // Batch clear operations
        await Promise.all([
          SecureStore.deleteItemAsync(this.ACCESS_TOKEN_KEY).catch(() => {}),
          SecureStore.deleteItemAsync(this.REFRESH_TOKEN_KEY).catch(() => {}),
        ]);
      } catch (error) {
        console.error('Error clearing tokens:', error);
      }
    });
  }

  // Get auth header for API requests
  static async getAuthHeader(): Promise<string | null> {
    const token = await this.getToken();
    return token ? `Bearer ${token}` : null;
  }

  // Check if user is authenticated (has valid tokens)
  static async isAuthenticated(): Promise<boolean> {
    const [accessToken, refreshToken] = await Promise.all([
      this.getToken(),
      this.getRefreshToken(),
    ]);
    return !!(accessToken && refreshToken);
  }

  // Queue operations to prevent race conditions
  private static queueOperation<T>(operation: () => Promise<T>): Promise<T> {
    this.operationQueue = this.operationQueue.then(operation, operation);
    return this.operationQueue;
  }

  // Get token info for debugging
  static async getTokenInfo(): Promise<{
    hasAccessToken: boolean;
    hasRefreshToken: boolean;
    isInitialized: boolean;
  }> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    return {
      hasAccessToken: !!this.accessTokenCache,
      hasRefreshToken: !!this.refreshTokenCache,
      isInitialized: this.isInitialized,
    };
  }
}

export default OptimizedTokenManager;