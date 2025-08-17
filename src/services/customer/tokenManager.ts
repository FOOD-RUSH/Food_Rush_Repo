import * as SecureStore from 'expo-secure-store';

class TokenManager {
  static TOKEN_KEY = 'auth_token';
  static REFRESH_TOKEN_KEY = 'refresh_token';

  // Store access token
  static async setToken(token: string) {
    try {
      await SecureStore.setItemAsync(this.TOKEN_KEY, token);
      return true;
    } catch (error) {
      console.error('Error storing token:', error);
      return false;
    }
  }

  // Retrieve access token
  static async getToken() {
    try {
      const token = await SecureStore.getItemAsync(this.TOKEN_KEY);
      return token;
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null;
    }
  }

  // Store refresh token
  static async setRefreshToken(refreshToken: string) {
    try {
      await SecureStore.setItemAsync(this.REFRESH_TOKEN_KEY, refreshToken);
      return true;
    } catch (error) {
      console.error('Error storing refresh token:', error);
      return false;
    }
  }

  // Retrieve refresh token
  static async getRefreshToken() {
    try {
      const refreshToken = await SecureStore.getItemAsync(this.REFRESH_TOKEN_KEY);
      return refreshToken;
    } catch (error) {
      console.error('Error retrieving refresh token:', error);
      return null;
    }
  }

  // Store both tokens at once
  static async setTokens(accessToken: string, refreshToken: string) {
    try {
      await Promise.all([
        SecureStore.setItemAsync(this.TOKEN_KEY, accessToken),
        SecureStore.setItemAsync(this.REFRESH_TOKEN_KEY, refreshToken)
      ]);
      return true;
    } catch (error) {
      console.error('Error storing tokens:', error);
      return false;
    }
  }

  // Clear access token
  static async clearToken() {
    try {
      await SecureStore.deleteItemAsync(this.TOKEN_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing token:', error);
      return false;
    }
  }

  // Clear refresh token
  static async clearRefreshToken() {
    try {
      await SecureStore.deleteItemAsync(this.REFRESH_TOKEN_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing refresh token:', error);
      return false;
    }
  }

  // Clear all tokens (logout)
  static async clearAllTokens() {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(this.TOKEN_KEY),
        SecureStore.deleteItemAsync(this.REFRESH_TOKEN_KEY)
      ]);
      return true;
    } catch (error) {
      console.error('Error clearing all tokens:', error);
      return false;
    }
  }

  // Check if user is authenticated
  static async isAuthenticated() {
    try {
      const token = await this.getToken();
      return !!token;
    } catch (error) {
      console.error('Error checking authentication status:', error);
      return false;
    }
  }

  // Get token with Bearer prefix for API calls
  static async getAuthHeader() {
    try {
      const token = await this.getToken();
      return token ? `Bearer ${token}` : null;
    } catch (error) {
      console.error('Error getting auth header:', error);
      return null;
    }
  }
}

export default TokenManager;
