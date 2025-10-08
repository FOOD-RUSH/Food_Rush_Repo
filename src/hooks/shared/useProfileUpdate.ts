import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  profileApi,
  UpdateProfileRequest,
  UpdateProfileWithImageRequest,
  isLocalFileUri,
} from '@/src/services/shared/profileApi';
import { useAuthStore } from '@/src/stores/AuthStore';
import { User } from '@/src/types';
import { createImageFormDataObject } from '@/src/utils/imageUtils';

// Combined interface for the hook
interface ProfileUpdateData {
  fullName?: string;
  phoneNumber?: string;
  profilePicture?: string; // Can be URL or local file URI
}

/**
 * Unified hook for updating user profiles (both customer and restaurant)
 * Uses PATCH /api/v1/auth/profile endpoint
 * Automatically detects if image upload is needed based on profilePicture value
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { setUser, clearError, user } = useAuthStore();

  return useMutation({
    mutationFn: async (data: ProfileUpdateData) => {
      // Check if we have a local file URI that needs to be uploaded
      const hasLocalImage = data.profilePicture && isLocalFileUri(data.profilePicture);
      
      if (hasLocalImage) {
        // Use FormData approach for image upload
        const imageData: UpdateProfileWithImageRequest = {
          fullName: data.fullName,
          phoneNumber: data.phoneNumber,
          picture: createImageFormDataObject({
            uri: data.profilePicture!,
            type: 'image/jpeg', // Default type, could be improved
            name: `profile-${Date.now()}.jpg`,
          }),
        };
        
        console.log('📤 Updating profile with image upload...');
        const response = await profileApi.updateProfileWithImage(imageData);
        return response.data.data;
      } else {
        // Use JSON approach for URL or no image
        const jsonData: UpdateProfileRequest = {
          fullName: data.fullName,
          phoneNumber: data.phoneNumber,
          profilePicture: data.profilePicture, // Should be URL or undefined
        };
        
        console.log('📤 Updating profile with JSON data...');
        const response = await profileApi.updateProfile(jsonData);
        return response.data.data;
      }
    },
    onMutate: () => {
      clearError();
    },
    onSuccess: (updatedUser: User) => {
      console.log('✅ Profile updated successfully:', updatedUser);

      // Update user in auth store
      setUser(updatedUser);

      // Update cached profile data
      queryClient.setQueryData(['auth', 'me'], updatedUser);

      // Invalidate profile queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });

      // Invalidate user-specific queries based on role
      if (updatedUser.role === 'customer') {
        queryClient.invalidateQueries({ queryKey: ['customer'] });
      } else if (updatedUser.role === 'restaurant') {
        queryClient.invalidateQueries({ queryKey: ['restaurant'] });
      }
    },
    onError: (error: any) => {
      console.error('❌ Profile update failed:', error);

      // Log detailed error information
      if (error?.response?.data) {
        console.error('Error details:', error.response.data);
      }
      
      // Log the data that was being sent for debugging
      console.error('Failed request data:', {
        hasProfilePicture: !!error.config?.data?.profilePicture,
        isFormData: error.config?.data instanceof FormData,
        url: error.config?.url,
        method: error.config?.method,
      });
    },
  });
};

/**
 * Hook for getting current user profile
 * Uses GET /api/v1/auth/profile endpoint
 */
export const useGetProfile = () => {
  const queryClient = useQueryClient();
  const { setUser, isAuthenticated } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      const response = await profileApi.getProfile();
      return response.data.data;
    },
    onSuccess: (userData: User) => {
      console.log('✅ Profile fetched successfully:', userData);

      // Update user in auth store
      setUser(userData);

      // Update cached profile data
      queryClient.setQueryData(['auth', 'me'], userData);
    },
    onError: (error: any) => {
      console.error('❌ Failed to fetch profile:', error);
    },
  });
};
