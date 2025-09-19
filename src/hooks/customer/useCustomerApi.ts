// hooks/customer/index.ts - Updated to match your existing pattern
import { useQuery } from '@tanstack/react-query';
import {
  restaurantApi,
  RestaurantQuery,
} from '@/src/services/customer/restaurant.service';
import { useLocationForQueries } from './useLocationService';

const CACHE_CONFIG = {
  STALE_TIME: 5 * 60 * 1000, // 5 minutes
  CACHE_TIME: 10 * 60 * 1000, // 10 minutes
  MAX_RETRIES: 3,
};

// Note: useMenuCategories has been moved to shared/useCategoriesApi for consistency

// Updated to match your existing naming convention
export const useGetAllMenu = (options: { enabled?: boolean } = {}) => {
  const { nearLat, nearLng, locationQueryKey } = useLocationForQueries();

  return useQuery({
    queryKey: ['menu', 'all', ...locationQueryKey],
    queryFn: async () => {
      try {
        const result = await restaurantApi.getAllMenuItems({
          nearLat,
          nearLng,
        });
        return result;
      } catch (error) {
        console.error('Error fetching all menu:', error);
        throw error;
      }
    },
    enabled: (options.enabled ?? true) && !!(nearLat && nearLng),
    staleTime: CACHE_CONFIG.STALE_TIME,
    gcTime: CACHE_CONFIG.CACHE_TIME,
    retry: CACHE_CONFIG.MAX_RETRIES,
  });
};

export const useGetAllMenuItem = () => {
  return useQuery({
    queryKey: ['menu', 'all'],
    queryFn: async () => {
      try {
        const result = await restaurantApi.getAllMenu2();
        return result;
      } catch (error) {
        console.error('Error fetching all menu:', error);
        throw error;
      }
    },
    staleTime: CACHE_CONFIG.STALE_TIME,
    gcTime: CACHE_CONFIG.CACHE_TIME,
    retry: CACHE_CONFIG.MAX_RETRIES,
  });
};

// Hook for restaurant details with automatic location
export const useRestaurantDetails = (id: string) => {
  const { nearLat, nearLng, locationQueryKey } = useLocationForQueries();

  return useQuery({
    queryKey: ['restaurant-details', id, ...locationQueryKey],
    queryFn: () => restaurantApi.getRestaurantDetails(id, nearLat, nearLng),
    enabled: !!id,
    staleTime: CACHE_CONFIG.STALE_TIME,
    gcTime: CACHE_CONFIG.CACHE_TIME,
    retry: CACHE_CONFIG.MAX_RETRIES,
  });
};
// Hook for nearby restaurants with automatic location
export const useNearbyRestaurants = () => {
  const { nearLat, nearLng, locationQueryKey } = useLocationForQueries();

  return useQuery({
    queryKey: ['nearby-restaurants', ...locationQueryKey, { nearLat, nearLng }],
    queryFn: () =>
      restaurantApi.getNearbyRestaurants({
        nearLat,
        nearLng,
        verificationStatus: 'APPROVED',
        isOpen: true,
      }),
    enabled: !!(nearLat && nearLng),
    staleTime: CACHE_CONFIG.STALE_TIME,
    gcTime: CACHE_CONFIG.CACHE_TIME,
    retry: CACHE_CONFIG.MAX_RETRIES,
  });
};
// Additional hooks for the simplified version
export const useAllRestaurants = (query: RestaurantQuery) => {
  const { nearLat, nearLng, locationQueryKey } = useLocationForQueries();

  return useQuery({
    queryKey: ['restaurants', 'all', ...locationQueryKey, query],
    queryFn: async () => {
      try {
        const result = await restaurantApi.getAllRestaurants({
          ...query,
          nearLat: nearLat,
          nearLng: nearLng,
          isOpen: true,
          verificationStatus: 'APPROVED',
        });
        return result;
      } catch (error) {
        console.error('Error fetching all restaurants:', error);
        throw error;
      }
    },
    staleTime: CACHE_CONFIG.STALE_TIME,
    gcTime: CACHE_CONFIG.CACHE_TIME,
    retry: CACHE_CONFIG.MAX_RETRIES,
    enabled: !!(nearLat && nearLng),
  });
};

// Hook for menu item by ID with automatic location
export const useMenuItemById = (id: string) => {
  const { nearLat, nearLng, locationQueryKey } = useLocationForQueries();

  return useQuery({
    queryKey: ['menu-item', id, ...locationQueryKey],
    queryFn: () => restaurantApi.getMenuItemById(id, nearLat, nearLng),
    // enabled: enabled && !!id,
    staleTime: CACHE_CONFIG.STALE_TIME,
    gcTime: CACHE_CONFIG.CACHE_TIME,
    retry: CACHE_CONFIG.MAX_RETRIES,
  });
};

// Hook for restaurant reviews
export const useRestaurantReviews = (restaurantId: string) => {
  return useQuery({
    queryKey: ['restaurant-reviews', restaurantId],
    queryFn: () => restaurantApi.getRestaurantReviews(restaurantId),
    enabled: !!restaurantId,
    staleTime: CACHE_CONFIG.STALE_TIME,
    gcTime: CACHE_CONFIG.CACHE_TIME,
    retry: CACHE_CONFIG.MAX_RETRIES,
  });
};
