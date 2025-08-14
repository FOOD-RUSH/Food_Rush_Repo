import { apiClient } from './apiClient';

export const restaurantApi = {
  // get restaurant
  // get restaurant by id
  // get restaurant snear you
  // get restaurant having promos
  //
  getAllRestaurants: async () => apiClient.get('restaurants'),
  getRestaurantById: async (id: string) => apiClient.get(`/restaurants/${id}`),
  getRestaurantMenu: async (id: string, category?: string) => {
    const url = category
      ? `/restaurants/${id}/category=${category}`
      : `/restaurants/${id}/`;
    return apiClient.get(url);
  },
  getNearbyRestaurants: async (
    latitude: number,
    longitude: number,
    radius: number = 5,
  ) => {
    return apiClient.get(
      `/restaurants/nearby?lat=${latitude}&lng=${longitude}&radius=${radius}`,
    );
  },
};
