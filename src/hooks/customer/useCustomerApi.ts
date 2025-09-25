// hooks/customer/index.ts - Updated to match your existing pattern
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
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

// Hook for nearby menu items with live location
export const useGetAllMenu = (options: { enabled?: boolean } = {}) => {
  const { nearLat, nearLng, locationQueryKey, locationSource } =
    useLocationForQueries();

  console.log('🍽️ useGetAllMenu Hook:', {
    nearLat,
    nearLng,
    locationSource,
    enabled: (options.enabled ?? true) && !!(nearLat && nearLng),
  });

  return useQuery({
    queryKey: ['menu', 'all', 'nearby', ...locationQueryKey],
    queryFn: async () => {
      try {
        console.log('🔄 Fetching nearby menu items with coordinates:', {
          nearLat,
          nearLng,
        });
        const result = await restaurantApi.getAllMenuItems({
          nearLat,
          nearLng,
        });
        console.log('✅ Nearby menu items fetched:', {
          count: result?.length || 0,
        });
        return result;
      } catch (error) {
        console.error('❌ Error fetching nearby menu:', error);
        throw error;
      }
    },
    enabled: (options.enabled ?? true) && !!(nearLat && nearLng),
    staleTime: CACHE_CONFIG.STALE_TIME,
    gcTime: CACHE_CONFIG.CACHE_TIME,
    retry: CACHE_CONFIG.MAX_RETRIES,
  });
};

// Fallback hook for all menu items (without location) - used as backup
export const useGetAllMenuItem = (options: { enabled?: boolean } = {}) => {
  const { nearLat, nearLng, locationQueryKey } = useLocationForQueries();

  console.log('🍽️ useGetAllMenuItem Hook (fallback):', {
    enabled: options.enabled ?? true,
    hasCoordinates: !!(nearLat && nearLng),
  });

  return useQuery({
    queryKey: ['menu', 'all', 'fallback', ...locationQueryKey],
    queryFn: async () => {
      try {
        console.log('🔄 Fetching all menu items (fallback)');
        const result = await restaurantApi.getAllMenu2();
        console.log('✅ All menu items fetched (fallback):', {
          count: result?.length || 0,
        });
        return result;
      } catch (error) {
        console.error('❌ Error fetching all menu (fallback):', error);
        throw error;
      }
    },
    enabled: options.enabled ?? true,
    staleTime: CACHE_CONFIG.STALE_TIME,
    gcTime: CACHE_CONFIG.CACHE_TIME,
    retry: CACHE_CONFIG.MAX_RETRIES,
  });
};

// Hook for restaurant details with automatic location
export const useRestaurantDetails = (
  id: string,
  options: { enabled?: boolean } = {},
) => {
  const { nearLat, nearLng, locationQueryKey, locationSource } =
    useLocationForQueries();

  console.log('🏪 useRestaurantDetails Hook:', {
    restaurantId: id,
    nearLat,
    nearLng,
    locationSource,
    enabled: (options.enabled ?? true) && !!id && !!(nearLat && nearLng),
  });

  return useQuery({
    queryKey: ['restaurant-details', id, ...locationQueryKey],
    queryFn: () => {
      console.log('🔄 Fetching restaurant details with coordinates:', {
        id,
        nearLat,
        nearLng,
      });
      return restaurantApi.getRestaurantDetails(id, nearLat, nearLng);
    },
    enabled: (options.enabled ?? true) && !!id && !!(nearLat && nearLng),
    staleTime: CACHE_CONFIG.STALE_TIME,
    gcTime: CACHE_CONFIG.CACHE_TIME,
    retry: CACHE_CONFIG.MAX_RETRIES,
  });
};
// Hook for browsing restaurants with automatic location
export const useBrowseRestaurants = (
  options: Partial<RestaurantQuery> = {},
) => {
  const { nearLat, nearLng, locationQueryKey, locationSource } =
    useLocationForQueries();

  const queryParams = {
    nearLat,
    nearLng,
    verificationStatus: 'APPROVED' as const,
    isOpen: true,
    radiusKm: 15, // Default radius
    limit: 20, // Default limit
    sortDir: 'ASC' as const, // Default sort direction
    ...options, // Allow overriding default options
  };

  console.log('🏦 useBrowseRestaurants Hook:', {
    nearLat,
    nearLng,
    locationSource,
    queryParams,
    enabled: !!(nearLat && nearLng),
  });

  return useQuery({
    queryKey: ['browse-restaurants', ...locationQueryKey, queryParams],
    queryFn: () => {
      console.log(
        '🔄 Fetching browse restaurants with coordinates:',
        queryParams,
      );
      return restaurantApi.getBrowseRestaurants(queryParams);
    },
    enabled: !!(nearLat && nearLng),
    staleTime: CACHE_CONFIG.STALE_TIME,
    gcTime: CACHE_CONFIG.CACHE_TIME,
    retry: CACHE_CONFIG.MAX_RETRIES,
  });
};

// Keep legacy export for backward compatibility
export const useNearbyRestaurants = (
  options: Partial<RestaurantQuery> = {},
) => {
  return useBrowseRestaurants(options);
};
// Hook for all restaurants with location-based sorting - now uses browse endpoint
export const useAllRestaurants = (query: RestaurantQuery = {}) => {
  const { nearLat, nearLng, locationQueryKey, locationSource } =
    useLocationForQueries();

  const queryParams = {
    ...query,
    nearLat,
    nearLng,
    isOpen: true,
    verificationStatus: 'APPROVED' as const,
    limit: query.limit || 50, // Default limit
    sortDir: query.sortDir || 'ASC', // Default sort direction
  };

  console.log('🏦 useAllRestaurants Hook:', {
    nearLat,
    nearLng,
    locationSource,
    queryParams,
    enabled: !!(nearLat && nearLng),
  });

  return useQuery({
    queryKey: ['restaurants', 'all', ...locationQueryKey, queryParams],
    queryFn: async () => {
      try {
        console.log(
          '🔄 Fetching all restaurants with coordinates:',
          queryParams,
        );
        const result = await restaurantApi.getBrowseRestaurants(queryParams);
        console.log('✅ All restaurants fetched:', {
          count: result?.length || 0,
        });
        return result;
      } catch (error) {
        console.error('❌ Error fetching all restaurants:', error);
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
export const useMenuItemById = (
  id: string,
  options: { enabled?: boolean } = {},
) => {
  const { nearLat, nearLng, locationQueryKey, locationSource } =
    useLocationForQueries();

  console.log('🍽️ useMenuItemById Hook:', {
    menuItemId: id,
    nearLat,
    nearLng,
    locationSource,
    enabled: (options.enabled ?? true) && !!id && !!(nearLat && nearLng),
  });

  return useQuery({
    queryKey: ['menu-item', id, ...locationQueryKey],
    queryFn: () => {
      console.log('🔄 Fetching menu item details with coordinates:', {
        id,
        nearLat,
        nearLng,
      });
      return restaurantApi.getMenuItemById(id, nearLat, nearLng);
    },
    enabled: (options.enabled ?? true) && !!id && !!(nearLat && nearLng),
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
  });
};

// Hook for creating restaurant review
export const useCreateRestaurantReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      restaurantId,
      reviewData,
    }: {
      restaurantId: string;
      reviewData: { score: number; review: string };
    }) => restaurantApi.createRestaurantReview(restaurantId, reviewData),
    onSuccess: (data, variables) => {
      // Invalidate and refetch restaurant reviews
      queryClient.invalidateQueries({
        queryKey: ['restaurant-reviews', variables.restaurantId],
      });
      // Also invalidate restaurant details to update rating
      queryClient.invalidateQueries({
        queryKey: ['restaurant-details', variables.restaurantId],
      });
    },
  });
};
