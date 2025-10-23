import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthUser } from '@/src/stores/customerStores';
import { RestaurantCard as RestaurantCardType } from '@/src/types';
import { restaurantApi } from '@/src/services/customer/restaurant.service';
import { useTranslation } from 'react-i18next';

// Hook to get user's favorite/liked restaurants
export const useFavoriteRestaurants = () => {
  const user = useAuthUser();
  const { t } = useTranslation();

  return useQuery({
    queryKey: ['favorite-restaurants', user?.id],
    queryFn: async (): Promise<RestaurantCardType[]> => {
      // Check if user is authenticated
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      // Call the real API
      return await restaurantApi.getLikedRestaurants();
    },
    enabled: !!user?.id, // Only fetch if user is authenticated
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      // Don't retry on authentication errors
      if (
        error instanceof Error &&
        (error.message === 'User not authenticated' ||
          error.message.includes('401'))
      ) {
        return false;
      }
      // Retry up to 3 times for other errors
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Note: Individual hooks are exported below

// Hook for liking a restaurant
export const useLikeRestaurant = () => {
  const queryClient = useQueryClient();
  const user = useAuthUser();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (restaurantId: string) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      return await restaurantApi.likeRestaurant(restaurantId);
    },
    onSuccess: (data, restaurantId) => {
      // Invalidate and refetch favorite restaurants
      queryClient.invalidateQueries({ queryKey: ['favorite-restaurants'] });

      // Optionally update other restaurant-related queries
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
      queryClient.invalidateQueries({ queryKey: ['restaurant', restaurantId] });
    },
    onError: (error: any) => {
      console.error('Error liking restaurant:', error);
    },
  });
};

// Hook for unliking a restaurant
export const useUnlikeRestaurant = () => {
  const queryClient = useQueryClient();
  const user = useAuthUser();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (restaurantId: string) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      return await restaurantApi.unlikeRestaurant(restaurantId);
    },
    onSuccess: (data, restaurantId) => {
      // Invalidate and refetch favorite restaurants
      queryClient.invalidateQueries({ queryKey: ['favorite-restaurants'] });

      // Optionally update other restaurant-related queries
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
      queryClient.invalidateQueries({ queryKey: ['restaurant', restaurantId] });
    },
    onError: (error: any) => {
      console.error('Error unliking restaurant:', error);
    },
  });
};

// Hook for toggling favorite status (combines like/unlike)
export const useToggleFavorite = () => {
  const likeRestaurant = useLikeRestaurant();
  const unlikeRestaurant = useUnlikeRestaurant();
  const { data: favoriteRestaurants } = useFavoriteRestaurants();

  return {
    toggleFavorite: async (restaurantId: string) => {
      // Check if restaurant is currently liked
      const isCurrentlyLiked = favoriteRestaurants?.some(
        (restaurant) => restaurant.id === restaurantId,
      );

      if (isCurrentlyLiked) {
        return await unlikeRestaurant.mutateAsync(restaurantId);
      } else {
        return await likeRestaurant.mutateAsync(restaurantId);
      }
    },
    isLoading: likeRestaurant.isPending || unlikeRestaurant.isPending,
  };
};

// Hook to check if a restaurant is liked
export const useIsRestaurantLiked = (restaurantId: string) => {
  const { data: favoriteRestaurants } = useFavoriteRestaurants();

  return (
    favoriteRestaurants?.some((restaurant) => restaurant.id === restaurantId) ||
    false
  );
};
