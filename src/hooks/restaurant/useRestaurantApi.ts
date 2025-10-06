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
    mutationFn: ({ restaurantId, ...data }: { restaurantId: string; latitude?: number; longitude?: number }) => 
      restaurantApi.updateLocation(restaurantId, data),
    onSuccess: async (response) => {
      // Update the restaurant profile store with the returned data
      if (response.data.status_code === 200 && response.data.data) {
        const updatedProfile = response.data.data;
        
        try {
          // Import the store dynamically to avoid circular dependencies
          const { useRestaurantProfileStore } = await import('@/src/stores/restaurantStores/restaurantProfileStore');
          const { updateRestaurantProfile } = useRestaurantProfileStore.getState();
          
          // Update the store with the new profile data
          updateRestaurantProfile({
            ...updatedProfile,
            // Ensure latitude and longitude are numbers (API returns them as strings)
            latitude: updatedProfile.latitude ? parseFloat(updatedProfile.latitude) : null,
            longitude: updatedProfile.longitude ? parseFloat(updatedProfile.longitude) : null,
          });
          
          console.log('✅ Restaurant profile store updated with new location data');
        } catch (error) {
          console.error('❌ Failed to update restaurant profile store:', error);
        }
      }
      
      // Update React Query cache directly with the new data
      queryClient.setQueryData(['restaurant', 'profile'], (oldData: any) => {
        if (oldData && response.data.data) {
          return {
            ...oldData,
            data: {
              ...oldData.data,
              ...response.data.data,
              latitude: response.data.data.latitude ? parseFloat(response.data.data.latitude) : null,
              longitude: response.data.data.longitude ? parseFloat(response.data.data.longitude) : null,
            }
          };
        }
        return oldData;
      });
      
      // Also invalidate queries to trigger refetch for any other components
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
