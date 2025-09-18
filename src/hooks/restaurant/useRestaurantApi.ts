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

export const useUpdateRestaurantProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restaurantAuthApi.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant', 'profile'] });
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Restaurant profile updated successfully',
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.response?.data?.message || 'Failed to update profile',
      });
    },
  });
};

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

// Restaurant Analytics Hooks (commented out - using dummy data for now)
// export const useRestaurantStats = (period?: 'today' | 'yesterday' | '7days' | '30days') => {
//   return useQuery({
//     queryKey: ['restaurant', 'stats', period],
//     queryFn: () => restaurantApi.getStats(period),
//     staleTime: 2 * 60 * 1000, // 2 minutes
//   });
// };

// export const useRestaurantBestSellers = (period?: string) => {
//   return useQuery({
//     queryKey: ['restaurant', 'bestsellers', period],
//     queryFn: () => restaurantApi.getBestSellers(period),
//     staleTime: 5 * 60 * 1000, // 5 minutes
//   });
// };

// export const useRestaurantTimeHeatmap = (period?: string) => {
//   return useQuery({
//     queryKey: ['restaurant', 'heatmap', period],
//     queryFn: () => restaurantApi.getTimeHeatmap(period),
//     staleTime: 5 * 60 * 1000, // 5 minutes
//   });
// };

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
