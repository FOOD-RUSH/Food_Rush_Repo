import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { restaurantApi } from '@/src/services/restaurant/restaurantApi';
import { restaurantAuthApi } from '@/src/services/restaurant/authApi';
import Toast from 'react-native-toast-message';

// Restaurant Profile Hooks
export const useRestaurantProfile = () => {
  return useQuery({
    queryKey: ['restaurant', 'profile'],
    queryFn: () => restaurantAuthApi.getProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Note: useUpdateRestaurantProfile is now available in useAuthhooks.ts
// This duplicate has been removed to avoid conflicts

// Legacy toggle status (for backward compatibility)
export const useToggleRestaurantStatus = (isActive: boolean, id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => restaurantApi.toggleStatus(isActive, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant', 'profile'] });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2:
          error?.response?.data?.message ||
          'Failed to toggle restaurant status',
      });
    },
  });
};

// Restaurant Analytics Hooks - moved to dedicated analytics hooks file
// See src/hooks/restaurant/useAnalytics.ts for analytics-specific hooks

// Restaurant Location Hooks
export const useUpdateRestaurantLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restaurantApi.updateLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant', 'profile'] });
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Restaurant location updated successfully',
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.response?.data?.message || 'Failed to update location',
      });
    },
  });
};
