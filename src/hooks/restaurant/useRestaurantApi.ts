import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { restaurantApi, RestaurantProfile, RestaurantStats } from '@/src/services/restaurant/restaurantApi';
import { useAuthUser } from '@/src/stores/customerStores/AuthStore';
import Toast from 'react-native-toast-message';

// Restaurant Profile Hooks
export const useRestaurantProfile = () => {
  return useQuery({
    queryKey: ['restaurant', 'profile'],
    queryFn: () => restaurantApi.getProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateRestaurantProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: restaurantApi.updateProfile,
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

// Restaurant Status Hooks
export const useUpdateRestaurantStatus = () => {
  const queryClient = useQueryClient();
  const user = useAuthUser();
  
  return useMutation({
    mutationFn: ({ status }: { status: 'online' | 'offline' | 'busy' }) => {
      if (!user?.restaurantId) {
        throw new Error('Restaurant ID not found');
      }
      return restaurantApi.updateStatus(user.restaurantId, status);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['restaurant', 'profile'] });
      
      const statusMessages = {
        online: 'Restaurant is now online and accepting orders',
        offline: 'Restaurant is now offline',
        busy: 'Restaurant status set to busy'
      };
      
      Toast.show({
        type: 'success',
        text1: 'Status Updated',
        text2: statusMessages[variables.status],
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.response?.data?.message || 'Failed to update restaurant status',
      });
    },
  });
};

// Legacy toggle status (for backward compatibility)
export const useToggleRestaurantStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: restaurantApi.toggleStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant', 'profile'] });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.response?.data?.message || 'Failed to toggle restaurant status',
      });
    },
  });
};

// Restaurant Analytics Hooks
export const useRestaurantStats = (period?: 'today' | 'yesterday' | '7days' | '30days') => {
  return useQuery({
    queryKey: ['restaurant', 'stats', period],
    queryFn: () => restaurantApi.getStats(period),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useRestaurantBestSellers = (period?: string) => {
  return useQuery({
    queryKey: ['restaurant', 'bestsellers', period],
    queryFn: () => restaurantApi.getBestSellers(period),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useRestaurantTimeHeatmap = (period?: string) => {
  return useQuery({
    queryKey: ['restaurant', 'heatmap', period],
    queryFn: () => restaurantApi.getTimeHeatmap(period),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

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

// Restaurant Notifications Hooks
export const useRestaurantNotifications = (params?: { 
  type?: string; 
  isRead?: boolean; 
  limit?: number; 
  offset?: number 
}) => {
  return useQuery({
    queryKey: ['restaurant', 'notifications', params],
    queryFn: () => restaurantApi.getNotifications(params),
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: restaurantApi.markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant', 'notifications'] });
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: restaurantApi.markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant', 'notifications'] });
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'All notifications marked as read',
      });
    },
  });
};

// Restaurant Settings Hooks
export const useRestaurantSettings = () => {
  return useQuery({
    queryKey: ['restaurant', 'settings'],
    queryFn: () => restaurantApi.getSettings(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useUpdateRestaurantSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: restaurantApi.updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant', 'settings'] });
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Settings updated successfully',
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.response?.data?.message || 'Failed to update settings',
      });
    },
  });
};

// Image Upload Hook
export const useUploadRestaurantImage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ formData, type }: { formData: FormData; type: 'profile' | 'banner' | 'menu' }) => 
      restaurantApi.uploadImage(formData, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant', 'profile'] });
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Image uploaded successfully',
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.response?.data?.message || 'Failed to upload image',
      });
    },
  });
};