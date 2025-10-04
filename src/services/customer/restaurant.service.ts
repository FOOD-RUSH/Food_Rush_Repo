import { apiClient } from '@/src/services/shared/apiClient';
import { logError } from '@/src/utils/errorHandler';
import type {
  FoodProps,
  MenuProps,
  RestaurantCard,
  RestaurantProfile,
  RestaurantReviewsResponse,
} from '@/src/types';

// Updated query parameters to match API documentation
export interface RestaurantQuery {
  isOpen?: boolean;
  nearLat?: number;
  nearLng?: number;
  radiusKm?: number;
  verificationStatus?: 'PENDING_VERIFICATION' | 'APPROVED' | 'REJECTED';
  menuMode?: 'FIXED' | 'DAILY';
  limit?: number;
  page?: number;
  sortDir?: 'ASC' | 'DESC';
}

export interface FoodQuery {
  nearLat?: number;
  nearLng?: number;
  category?: string;
  limit?: number;
  page?: number;
}

interface FoodItems {
  data: FoodProps[];
}
interface FoodItem {
  data: MenuProps;
}

interface RestaurantItems {
  data: RestaurantCard[];
}
interface RestaurantReturn {
  data: RestaurantProfile;
}

// Note: Category fetching has been moved to shared/categoriesApi for consistency

export const restaurantApi = {
  // Get all restaurants with filtering
  getAllRestaurants: async (query: RestaurantQuery) => {
    try {
      const response = await apiClient.get<RestaurantItems>(
        '/restaurants/browse',
        { params: query },
      );
      return response.data.data;
    } catch (error) {
      logError(error, 'getAllRestaurants');
      throw error;
    }
  },

  // Get restaurants using browse endpoint (replaces nearby)
  getBrowseRestaurants: async (query: RestaurantQuery) => {
    try {
      console.log('🍽️ Browse Restaurants API Call:', {
        endpoint: '/restaurants/browse',
        params: query,
        coordinates: { lat: query.nearLat, lng: query.nearLng },
      });

      const response = await apiClient.get<RestaurantItems>(
        '/restaurants/browse',
        { params: query },
      );

      console.log('🍽️ Browse Restaurants API Response:', {
        status: response.status,
        dataCount: response.data.data?.length || 0,
        firstItem: response.data.data?.[0] || null,
      });

      return response.data.data;
    } catch (error) {
      console.error('❌ Browse Restaurants API Error:', error);
      logError(error, 'getBrowseRestaurants');
      throw error;
    }
  },

  // Get all nearby menu items with coordinates
  getAllMenuItems: async (query: FoodQuery) => {
    try {
      console.log('🍽️ Get All Menu Items API Call:', {
        endpoint: '/menu/all/nearby',
        params: query,
        coordinates: { lat: query.nearLat, lng: query.nearLng },
      });

      const response = await apiClient.get<FoodItems>('/menu/all/nearby', {
        params: query,
      });

      console.log('🍽️ Get All Menu Items API Response:', {
        status: response.status,
        dataCount: response.data.data?.length || 0,
        firstItem: response.data.data?.[0] || null,
      });

      return response.data.data;
    } catch (error) {
      console.error('❌ Get All Menu Items API Error:', error);
      logError(error, 'getAllMenuItems');
      throw error;
    }
  },

  // Browse menu items with category filtering
  browseMenuItems: async (query: FoodQuery) => {
    try {
      console.log('🍽️ Browse Menu Items API Call:', {
        endpoint: '/menu/browse',
        params: query,
        coordinates: { lat: query.nearLat, lng: query.nearLng },
        category: query.category,
      });

      const response = await apiClient.get<FoodItems>('/menu/browse', {
        params: query,
      });

      console.log('🍽️ Browse Menu Items API Response:', {
        status: response.status,
        dataCount: response.data.data?.length || 0,
        category: query.category,
        firstItem: response.data.data?.[0] || null,
        sampleCategories:
          response.data.data?.slice(0, 3).map((item) => ({
            name: item.name,
            category: item.category,
          })) || [],
      });

      return response.data.data;
    } catch (error) {
      console.error('❌ Browse Menu Items API Error:', error);
      logError(error, 'browseMenuItems');
      throw error;
    }
  },

  getAllMenu2: async () => {
    try {
      const response = await apiClient.get<FoodItems>('/menu/all');
      return response.data.data;
    } catch (error) {
      logError(error, 'getAllMenu2');
      throw error;
    }
  },

  // Get menu item by ID (updated to match API docs)
  getMenuItemById: async (id: string, nearLat?: number, nearLng?: number) => {
    try {
      const response = await apiClient.get<FoodItem>(`/menu-items/${id}`, {
        params: { nearLat, nearLng },
      });
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching menu item ${id}:`, error);
      throw error;
    }
  },

  // Get restaurant details (new endpoint from API docs)
  getRestaurantDetails: async (
    id: string,
    nearLat?: number,
    nearLng?: number,
  ) => {
    try {
      console.log('🍽️ Restaurant Details API Call:', {
        endpoint: `/restaurants/${id}/detail`,
        params: { nearLat, nearLng },
        coordinates: { lat: nearLat, lng: nearLng },
      });

      const response = await apiClient.get<RestaurantReturn>(
        `/restaurants/${id}/detail`,
        { params: { nearLat, nearLng } },
      );

      console.log('🍽️ Restaurant Details API Response:', {
        status: response.status,
        data: response.data.data,
      });

      return response.data.data;
    } catch (error) {
      console.error(`❌ Error fetching restaurant details ${id}:`, error);
      throw error;
    }
  },

  // Rate restaurant (new endpoint from API docs)
  rateRestaurant: async (id: string, score: number) => {
    try {
      const response = await apiClient.post(`/restaurants/${id}/rate`, {
        score,
      });
      return response.data;
    } catch (error) {
      console.error(`Error rating restaurant ${id}:`, error);
      throw error;
    }
  },

  // Delete restaurant rating (new endpoint from API docs)
  deleteRestaurantRating: async (id: string) => {
    try {
      const response = await apiClient.delete(`/restaurants/${id}/rate`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting rating for restaurant ${id}:`, error);
      throw error;
    }
  },

  // Like restaurant (new endpoint from API docs)
  likeRestaurant: async (id: string) => {
    try {
      console.log('💖 Liking restaurant:', id);
      const response = await apiClient.post(`/restaurants/${id}/like`);
      console.log('✅ Like restaurant response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error liking restaurant ${id}:`, error);
      logError(error, 'likeRestaurant');
      throw error;
    }
  },

  // Unlike restaurant (new endpoint from API docs)
  unlikeRestaurant: async (id: string) => {
    try {
      console.log('💔 Unliking restaurant:', id);
      const response = await apiClient.delete(`/restaurants/${id}/like`);
      console.log('✅ Unlike restaurant response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error unliking restaurant ${id}:`, error);
      logError(error, 'unlikeRestaurant');
      throw error;
    }
  },

  // Get liked restaurants (new endpoint from API docs)
  getLikedRestaurants: async () => {
    try {
      console.log('📜 Fetching liked restaurants...');
      const response = await apiClient.get<RestaurantItems>(
        '/restaurants/me/liked',
      );
      console.log('✅ Liked restaurants response:', {
        status: response.status,
        dataCount: response.data.data?.length || 0,
        firstItem: response.data.data?.[0] || null,
      });
      return response.data.data || [];
    } catch (error) {
      console.error('❌ Error fetching liked restaurants:', error);
      logError(error, 'getLikedRestaurants');
      throw error;
    }
  },

  // Get restaurant reviews
  getRestaurantReviews: async (id: string) => {
    try {
      const response = await apiClient.get<RestaurantReviewsResponse>(
        `/restaurants/${id}/reviews`,
      );
      console.log('Restaurant Reviews API Response:', response.data);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching reviews for restaurant ${id}:`, error);
      throw error;
    }
  },

  // Create restaurant review
  createRestaurantReview: async (
    id: string,
    reviewData: { score: number; review: string },
  ) => {
    try {
      const response = await apiClient.post(
        `/restaurants/${id}/reviews`,
        reviewData,
      );
      console.log('Create Review API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error creating review for restaurant ${id}:`, error);
      throw error;
    }
  },
};
