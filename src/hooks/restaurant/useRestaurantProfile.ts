import { useEffect, useCallback, useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRestaurantProfileStore, DetailedRestaurantProfile } from '@/src/stores/restaurantStores/restaurantProfileStore';
import { useCurrentRestaurant, useUser } from '@/src/stores/AuthStore';
import { restaurantApi } from '@/src/services/restaurant/restaurantApi';
import Toast from 'react-native-toast-message';

/**
 * Custom hook for managing restaurant profile with session-based loading
 * Fetches profile once per login session when account screen is first visited
 */
export const useRestaurantProfile = () => {
  const user = useUser();
  const currentRestaurant = useCurrentRestaurant();
  const queryClient = useQueryClient();
  
  const {
    restaurantProfile,
    isLoading,
    isUpdating,
    error,
    hasLoadedProfile,
    fetchRestaurantProfile,
    updateRestaurantProfile,
    updateIsOpen,
    markProfileAsLoaded,
    clearError,
    setLoading,
    setUpdating,
  } = useRestaurantProfileStore();

  /**
   * Load restaurant profile if needed
   * Called when account screen is first visited in a session
   */
  const loadProfileIfNeeded = useCallback(async () => {
    if (!currentRestaurant?.id || !user?.id) {
      console.log('No restaurant or user ID available');
      return;
    }

    // Check if we already have the profile loaded
    if (hasLoadedProfile && restaurantProfile) {
      console.log('Profile already loaded for this session');
      return;
    }

    // Prevent multiple simultaneous requests
    if (isLoading) {
      console.log('Profile fetch already in progress');
      return;
    }

    try {
      console.log('Fetching restaurant profile for restaurant:', currentRestaurant.id);
      await fetchRestaurantProfile(currentRestaurant.id);
      console.log('Restaurant profile loaded successfully');
    } catch (error) {
      console.error('Failed to load restaurant profile:', error);
    }
  }, [currentRestaurant?.id, user?.id, hasLoadedProfile, restaurantProfile, isLoading, fetchRestaurantProfile]);

  // Mark profile as loaded when we have restaurant profile data
  useEffect(() => {
    if (restaurantProfile && !hasLoadedProfile) {
      markProfileAsLoaded();
    }
  }, [restaurantProfile, hasLoadedProfile, markProfileAsLoaded]);

  /**
   * Toggle restaurant status (open/closed)
   */
  const toggleRestaurantStatus = useMutation({
    mutationFn: async (newStatus: boolean) => {
      if (!currentRestaurant?.id) {
        throw new Error('No restaurant ID available');
      }

      setUpdating(true);
      
      try {
        const response = await restaurantApi.toggleStatus(newStatus, currentRestaurant.id);
        
        if (response.data.status_code === 200) {
          // Update the store with the new status and full profile data
          const updatedProfile = response.data.data as DetailedRestaurantProfile;
          updateRestaurantProfile(updatedProfile);
          
          return response.data;
        } else {
          throw new Error(response.data.message || 'Failed to update restaurant status');
        }
      } finally {
        setUpdating(false);
      }
    },
    onSuccess: (data) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['restaurant', 'profile'] });
      
      const statusText = data.data.isOpen ? 'opened' : 'closed';
      Toast.show({
        type: 'success',
        text1: 'Status Updated',
        text2: `Restaurant ${statusText} successfully`,
      });
    },
    onError: (error: any) => {
      console.error('Failed to toggle restaurant status:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Failed to update restaurant status',
      });
    },
  });

  /**
   * Update restaurant profile data
   */
  const updateProfile = useCallback((profile: DetailedRestaurantProfile) => {
    updateRestaurantProfile(profile);
  }, [updateRestaurantProfile]);

  /**
   * Get current restaurant status
   */
  const getRestaurantStatus = useCallback(() => {
    return {
      isOpen: restaurantProfile?.isOpen || false,
      verificationStatus: restaurantProfile?.verificationStatus || 'PENDING',
      name: restaurantProfile?.name || currentRestaurant?.name || 'Restaurant',
    };
  }, [restaurantProfile, currentRestaurant]);

  return {
    // Profile data
    restaurantProfile,
    currentRestaurant,
    
    // Loading states
    isLoading,
    isUpdating,
    hasLoadedProfile,
    
    // Error handling
    error,
    clearError,
    
    // Actions
    loadProfileIfNeeded,
    toggleRestaurantStatus,
    updateProfile,
    getRestaurantStatus,
    
    // Computed values
    isOpen: restaurantProfile?.isOpen || false,
    verificationStatus: restaurantProfile?.verificationStatus || 'PENDING',
    restaurantName: restaurantProfile?.name || currentRestaurant?.name || 'Restaurant',
  };
};

/**
 * Hook specifically for restaurant status management
 */
export const useRestaurantStatus = () => {
  const { 
    isOpen, 
    verificationStatus, 
    restaurantName,
    toggleRestaurantStatus,
    isUpdating,
    getRestaurantStatus 
  } = useRestaurantProfile();

  return {
    isOpen,
    verificationStatus,
    restaurantName,
    isUpdating,
    toggleStatus: toggleRestaurantStatus.mutateAsync,
    getStatus: getRestaurantStatus,
  };
};