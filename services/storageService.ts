import AsyncStorage from '@react-native-async-storage/async-storage';

class StorageService {
  private static instance: StorageService;

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  async setItem(key: string, value: any): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error('Error storing data:', error);
      throw error;
    }
  }

  async getItem<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Error retrieving data:', error);
      return null;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing data:', error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }

  // Specific methods for common operations
  async storeUserPreferences(preferences: any): Promise<void> {
    await this.setItem('userPreferences', preferences);
  }

  async getUserPreferences(): Promise<any> {
    return await this.getItem('userPreferences');
  }

  async storeRecentSearches(searches: string[]): Promise<void> {
    await this.setItem('recentSearches', searches);
  }

  async getRecentSearches(): Promise<string[]> {
    return (await this.getItem('recentSearches')) || [];
  }
}

export const storageService = StorageService.getInstance();