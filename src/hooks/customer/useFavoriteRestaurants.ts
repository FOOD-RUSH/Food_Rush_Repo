import { useQuery } from '@tanstack/react-query';
import { useAuthUser } from '@/src/stores/customerStores/AuthStore';
import { RestaurantCard as RestaurantCardType } from '@/src/types';

// Mock data for favorite restaurants (replace with actual API call)
const mockFavoriteRestaurants: RestaurantCardType[] = [
  {
    id: '1',
    restaurantId: '1',
    name: 'Le Jardin',
    address: 'Centre-ville, Yaoundé',
    isOpen: true,
    imageUrl: 'https://example.com/restaurant1.jpg',
    rating: 4.5,
    deliveryFee: '500',
    deliveryPrice: 500,
    estimatedDeliveryTime: '25-35 min',
    distance: 2.3,
    distanceFromUser: 2.3,
  },
  {
    id: '2',
    restaurantId: '2',
    name: 'Chez Marie',
    address: 'Bastos, Yaoundé',
    isOpen: true,
    imageUrl: 'https://example.com/restaurant2.jpg',
    rating: 4.2,
    deliveryFee: '300',
    deliveryPrice: 300,
    estimatedDeliveryTime: '20-30 min',
    distance: 1.8,
    distanceFromUser: 1.8,
  },
  {
    id: '3',
    restaurantId: '3',
    name: 'La Belle Époque',
    address: 'Bonapriso, Douala',
    isOpen: false,
    imageUrl: 'https://example.com/restaurant3.jpg',
    rating: 4.7,
    deliveryFee: '700',
    deliveryPrice: 700,
    estimatedDeliveryTime: '30-40 min',
    distance: 3.1,
    distanceFromUser: 3.1,
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useFavoriteRestaurants = () => {
  const user = useAuthUser();

  return useQuery({
    queryKey: ['favorite-restaurants', user?.id],
    queryFn: async (): Promise<RestaurantCardType[]> => {
      // Simulate API call delay
      await delay(1500);

      // Check if user is authenticated
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      // Simulate occasional API errors (10% chance)
      if (Math.random() < 0.1) {
        throw new Error('Failed to fetch favorite restaurants');
      }

      // Return mock data (replace with actual API call)
      return mockFavoriteRestaurants;
    },
    enabled: !!user?.id, // Only fetch if user is authenticated
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      // Don't retry on authentication errors
      if (
        error instanceof Error &&
        error.message === 'User not authenticated'
      ) {
        return false;
      }
      // Retry up to 3 times for other errors
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Hook for toggling favorite status
export const useToggleFavorite = () => {
  const user = useAuthUser();

  return {
    toggleFavorite: async (restaurantId: string) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      // Simulate API call
      await delay(500);

      // Simulate occasional errors
      if (Math.random() < 0.05) {
        throw new Error('Failed to update favorite status');
      }

      // Return success (in real app, this would update the backend)
      return { success: true, restaurantId };
    },
  };
};
