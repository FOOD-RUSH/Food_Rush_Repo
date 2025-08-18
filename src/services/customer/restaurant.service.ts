import { RestaurantProfile, FoodProps } from '../../types';
import { apiClient } from './apiClient';

// Restaurant query parameters
export interface RestaurantQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'rating' | 'deliveryTime' | 'deliveryFee' | 'distance';
  sortOrder?: 'asc' | 'desc';
  cuisine?: string[];
  minRating?: number;
  maxDeliveryTime?: number;
  maxDeliveryFee?: number;
  isOpen?: boolean;
  coordinates?: {
    latitude: number;
    longitude: number;
    radius?: number;
  };
}

export const restaurantApi = {
  // Get all Menus
  getAllMenu: () => {
    return apiClient.get<FoodProps[]>('/menu/all')
  },

  // Get all restaurants with filtering and pagination
  getAllRestaurants: (query?: RestaurantQuery) => {
    return apiClient.get<RestaurantProfile[]>('/restaurants', { params: query });
  },

  // Get a specific restaurant by ID
  getRestaurantById: (id: string) => {
    return apiClient.get<RestaurantProfile>(`/restaurants/${id}`);
  },

  // Get restaurant menu with optional category filter
  getRestaurantMenu: (id: string, category?: string) => {
    const url = category
      ? `/restaurants/${id}/menu?category=${category}`
      : `/restaurants/${id}/menu`;
    return apiClient.get<FoodProps[]>(url);
  },

  // Get nearby restaurants based on location
  getNearbyRestaurants: (
    latitude: number,
    longitude: number,
    radius: number = 5,
  ) => {
    return apiClient.get<RestaurantProfile[]>(
      `/restaurants/nearby?lat=${latitude}&lng=${longitude}&radius=${radius}`,
    );
  },

  // Get a specific menu item
  getMenuItemById: (restaurantId: string, menuId: string) => {
    return apiClient.get<FoodProps>(`/restaurants/${restaurantId}/menu/${menuId}`);
  },

  

  // Search restaurants
  searchRestaurants: (query: string, filters?: Partial<RestaurantQuery>) => {
    return apiClient.get<RestaurantProfile[]>('restaurants/search', {
      params: { q: query, ...filters }
    });
  },

  // Get restaurant reviews
  getRestaurantReviews: (restaurantId: string, page: number = 1, limit: number = 10) => {
    return apiClient.get<any>(`/restaurants/${restaurantId}/reviews`, {
      params: { page, limit }
    });
  },

  // Get restaurant categories
  getRestaurantCategories: (restaurantId: string) => {
    return apiClient.get<string[]>(`/restaurants/${restaurantId}/categories`);
  },

  // Get popular restaurants
  getPopularRestaurants: (limit: number = 10) => {
    return apiClient.get<RestaurantProfile[]>('/restaurants/popular', {
      params: { limit }
    });
  },

  // Get restaurant by cuisine
  getRestaurantsByCuisine: (cuisine: string, limit: number = 10) => {
    return apiClient.get<RestaurantProfile[]>('/restaurants/cuisine', {
      params: { cuisine, limit }
    });
  },
};
