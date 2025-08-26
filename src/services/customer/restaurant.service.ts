import { RestaurantCard, FoodProps, RestaurantProfile } from '../../types';
import { apiClient } from './apiClient';

// Restaurant query parameters
export interface RestaurantQuery {
  isOpen: boolean;
  nearLat?: number;
  nearLng?: number;
  minDistanceKm?: number;
  maxDistanceKm?: number;
  radiusKm?: number;
  distance?: 'distance' | 'createdAt';
  sortDir?: 'ASC' | 'DESC';
  limit?: number;

};
interface foodItems {
  data: FoodProps[]
}
export const restaurantApi = {
  // Get all Menus
  getAllMenu: async () => {
    return apiClient.get<foodItems>('/menu/all').then((res) => {
      console.log(res.data.data)
      return res.data.data
    })
  },
  getMenuBrowseAll: async (query: RestaurantQuery) => {
    return apiClient.get<FoodProps[]>('/menu/browse', { params: query }).then((res) =>
      res.data
    )
  },
  // Get all restaurants with filtering and pagination
  getAllRestaurants: async (query?: RestaurantQuery) => {
    return apiClient.get<RestaurantCard[]>('/restaurants/browse', { params: query }).then((res) => res.data);
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
    return apiClient.get<RestaurantCard[]>(
      `/restaurants/nearby?nearLat=${latitude}&nearLng=${longitude}&radiusKm=${radius}`,
    );
  },

  // Get a specific menu item
  getMenuItemById: (restaurantId: string, menuId: string) => {
    return apiClient.get<FoodProps>(`/restaurants/${restaurantId}/menu/${menuId}`);

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



  // Get restaurant by cuisine
  getRestaurantsByCuisine: (cuisine: string, limit: number = 10) => {
    return apiClient.get<RestaurantCard[]>('/restaurants/cuisine', {
      params: { cuisine, limit }
    });
  },
};
