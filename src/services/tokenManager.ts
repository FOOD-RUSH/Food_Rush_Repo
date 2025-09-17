import * as SecureStore from 'expo-secure-store';

export type UserType = 'customer' | 'restaurant';

interface TokenData {
  accessToken: string;
  refreshToken: string;
  userType: UserType;
}

class TokenManager {
  private static ACCESS_TOKEN_KEY = 'access_token';
  private static REFRESH_TOKEN_KEY = 'refresh_token';
  private static USER_TYPE_KEY = 'user_type';
  
  // In-memory cache for performance
  private static cache: {
    accessToken: string | null;
    refreshToken: string | null;
    userType: UserType | null;
    isInitialized: boolean;
  } = {
    accessToken: null,
    refreshToken: null,
    userType: null,
    isInitialized: false,
  };

  // Initialize cache from secure storage
  private static async initialize(): Promise<void> {
    if (this.cache.isInitialized) return;

    try {
      const [accessToken, refreshToken, userType] = await Promise.all([
        SecureStore.getItemAsync(this.ACCESS_TOKEN_KEY),
        SecureStore.getItemAsync(this.REFRESH_TOKEN_KEY),
        SecureStore.getItemAsync(this.USER_TYPE_KEY),
      ]);

      this.cache = {
        accessToken,
        refreshToken,
        userType: userType as UserType,
        isInitialized: true,
      };
    } catch (error) {
      console.error('Error initializing tokens:', error);
      this.cache.isInitialized = true;
    }
  }

  // Get access token
  static async getAccessToken(): Promise<string | null> {
    await this.initialize();
    return this.cache.accessToken;
  }

  // Get refresh token
  static async getRefreshToken(): Promise<string | null> {
    await this.initialize();
    return this.cache.refreshToken;
  }

  // Get user type
  static async getUserType(): Promise<UserType | null> {
    await this.initialize();
    return this.cache.userType;
  }

  // Set all token data
  static async setTokens(data: TokenData): Promise<boolean> {
    try {
      // Update cache immediately
      this.cache.accessToken = data.accessToken;
      this.cache.refreshToken = data.refreshToken;
      this.cache.userType = data.userType;
      this.cache.isInitialized = true;

      // Store in secure storage
      await Promise.all([
        SecureStore.setItemAsync(this.ACCESS_TOKEN_KEY, data.accessToken),
        SecureStore.setItemAsync(this.REFRESH_TOKEN_KEY, data.refreshToken),
        SecureStore.setItemAsync(this.USER_TYPE_KEY, data.userType),
      ]);

      return true;
    } catch (error) {
      console.error('Error storing tokens:', error);
      return false;
    }
  }

  // Update access token only (for refresh)
  static async updateAccessToken(accessToken: string): Promise<boolean> {
    try {
      this.cache.accessToken = accessToken;
      await SecureStore.setItemAsync(this.ACCESS_TOKEN_KEY, accessToken);
      return true;
    } catch (error) {
      console.error('Error updating access token:', error);
      return false;
    }
  }

  // Clear all tokens
  static async clearTokens(): Promise<void> {
    try {
      // Clear cache immediately
      this.cache.accessToken = null;
      this.cache.refreshToken = null;
      this.cache.userType = null;

      // Clear from secure storage
      await Promise.all([
        SecureStore.deleteItemAsync(this.ACCESS_TOKEN_KEY).catch(() => {}),
        SecureStore.deleteItemAsync(this.REFRESH_TOKEN_KEY).catch(() => {}),
        SecureStore.deleteItemAsync(this.USER_TYPE_KEY).catch(() => {}),
      ]);
    } catch (error) {
      console.error('Error clearing tokens:', error);
    }
  }

  // Get auth header for API requests
  static async getAuthHeader(): Promise<string | null> {
    const token = await this.getAccessToken();
    return token ? `Bearer ${token}` : null;
  }

  // Check if user is authenticated
  static async isAuthenticated(): Promise<boolean> {
    const [accessToken, refreshToken] = await Promise.all([
      this.getAccessToken(),
      this.getRefreshToken(),
    ]);
    return !!(accessToken && refreshToken);
  }

  // Get all token data at once
  static async getTokenData(): Promise<{
    accessToken: string | null;
    refreshToken: string | null;
    userType: UserType | null;
  }> {
    await this.initialize();
    return {
      accessToken: this.cache.accessToken,
      refreshToken: this.cache.refreshToken,
      userType: this.cache.userType,
    };
  }
}

export default TokenManager;
