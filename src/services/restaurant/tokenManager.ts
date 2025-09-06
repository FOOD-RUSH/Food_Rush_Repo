import * as SecureStore from 'expo-secure-store';

class RestaurantTokenManager {
  static ACCESS_TOKEN_KEY = 'restaurant_access_token';
  static REFRESH_TOKEN_KEY = 'restaurant_refresh_token';
  static TOKEN_EXPIRY_KEY = 'restaurant_token_expiry';
  
  // Token refresh threshold (5 minutes before expiry)
  static REFRESH_THRESHOLD = 5 * 60 * 1000;

  // Store access token with expiry
  static async setToken(token: string, expiresIn?: number) {
    try {
      const expiryTime = expiresIn ? Date.now() + (expiresIn * 1000) : Date.now() + (24 * 60 * 60 * 1000); // Default 24 hours
      
      await Promise.all([
        SecureStore.setItemAsync(this.ACCESS_TOKEN_KEY, token),
        SecureStore.setItemAsync(this.TOKEN_EXPIRY_KEY, expiryTime.toString()),
      ]);
      
      return true;
    } catch (error) {
      console.error('Error storing restaurant token:', error);
      return false;
    }
  }

  // Retrieve access token
  static async getToken(): Promise<string | null> {
    try {
      const token = await SecureStore.getItemAsync(this.ACCESS_TOKEN_KEY);
      const expiryTime = await SecureStore.getItemAsync(this.TOKEN_EXPIRY_KEY);
      
      if (!token || !expiryTime) {
        return null;
      }
      
      const now = Date.now();
      const expiry = parseInt(expiryTime);
      
      // Check if token is expired
      if (now >= expiry) {
        await this.clearAllTokens();
        return null;
      }
      
      return token;
    } catch (error) {
      console.error('Error retrieving restaurant token:', error);
      return null;
    }
  }

  // Store refresh token
  static async setRefreshToken(refreshToken: string) {
    try {
      await SecureStore.setItemAsync(this.REFRESH_TOKEN_KEY, refreshToken);
      return true;
    } catch (error) {
      console.error('Error storing restaurant refresh token:', error);
      return false;
    }
  }

  // Retrieve refresh token
  static async getRefreshToken(): Promise<string | null> {
    try {
      const refreshToken = await SecureStore.getItemAsync(this.REFRESH_TOKEN_KEY);
      return refreshToken;
    } catch (error) {
      console.error('Error retrieving restaurant refresh token:', error);
      return null;
    }
  }

  // Store both tokens at once
  static async setTokens(accessToken: string, refreshToken: string, expiresIn?: number) {
    try {
      const success = await Promise.all([
        this.setToken(accessToken, expiresIn),
        this.setRefreshToken(refreshToken),
      ]);
      
      return success.every(Boolean);
    } catch (error) {
      console.error('Error storing restaurant tokens:', error);
      return false;
    }
  }

  // Check if token needs refresh
  static async shouldRefreshToken(): Promise<boolean> {
    try {
      const expiryTime = await SecureStore.getItemAsync(this.TOKEN_EXPIRY_KEY);
      if (!expiryTime) return true;
      
      const now = Date.now();
      const expiry = parseInt(expiryTime);
      
      return (expiry - now) <= this.REFRESH_THRESHOLD;
    } catch (error) {
      console.error('Error checking token refresh status:', error);
      return true;
    }
  }

  // Check if user is authenticated
  static async isAuthenticated(): Promise<boolean> {
    try {
      const token = await this.getToken();
      return !!token;
    } catch (error) {
      console.error('Error checking restaurant authentication status:', error);
      return false;
    }
  }

  // Get token with Bearer prefix for API calls
  static async getAuthHeader(): Promise<string | null> {
    try {
      const token = await this.getToken();
      return token ? `Bearer ${token}` : null;
    } catch (error) {
      console.error('Error getting restaurant auth header:', error);
      return null;
    }
  }

  // Clear access token
  static async clearToken() {
    try {
      await SecureStore.deleteItemAsync(this.ACCESS_TOKEN_KEY);
      await SecureStore.deleteItemAsync(this.TOKEN_EXPIRY_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing restaurant token:', error);
      return false;
    }
  }

  // Clear refresh token
  static async clearRefreshToken() {
    try {
      await SecureStore.deleteItemAsync(this.REFRESH_TOKEN_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing restaurant refresh token:', error);
      return false;
    }
  }

  // Clear all tokens (logout)
  static async clearAllTokens() {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(this.ACCESS_TOKEN_KEY),
        SecureStore.deleteItemAsync(this.REFRESH_TOKEN_KEY),
        SecureStore.deleteItemAsync(this.TOKEN_EXPIRY_KEY),
      ]);
      return true;
    } catch (error) {
      console.error('Error clearing all restaurant tokens:', error);
      return false;
    }
  }

  // Force logout (for security purposes)
  static async forceLogout() {
    try {
      await this.clearAllTokens();
      return true;
    } catch (error) {
      console.error('Error during force logout:', error);
      return false;
    }
  }
}

export default RestaurantTokenManager;
