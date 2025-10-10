import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  profileApi,
  UpdateProfileRequest,
  LocalImageData,
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
 * 
 * API: PATCH /api/v1/auth/profile
 * Content-Type: application/json
 * 
 * Automatically handles image upload workflow:
 * 1. If local image: upload image first to get URL, then update profile with JSON
 * 2. If URL or no image: update profile directly with JSON
 * 
 * Request format:
 * {
 *   "fullName": "Tochukwu Paul",
 *   "phoneNumber": "+237612345678",
 *   "profilePicture": "https://example.com/profile.jpg"
 * }
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { setUser, clearError } = useAuthStore();

  return useMutation({
    mutationFn: async (data: ProfileUpdateData) => {

      
      // Check if we have a local file URI that needs to be uploaded
      const hasLocalImage = data.profilePicture && isLocalFileUri(data.profilePicture);
      
      if (hasLocalImage) {
        // Use FormData approach for local images
        const imageData: LocalImageData = createImageFormDataObject({
          uri: data.profilePicture!,
          type: 'image/jpeg', // Default type, could be improved
          name: `profile-${Date.now()}.jpg`,
        });
        

        const response = await profileApi.updateProfileWithImage({
          fullName: data.fullName?.trim(),
          phoneNumber: data.phoneNumber?.trim(),
          picture: imageData,
        });
        return response.data;
      } else {
        // Use direct JSON approach for URL or no image
        const profileData: UpdateProfileRequest = {};
        
        // Only include fields that are provided and not empty
        if (data.fullName && data.fullName.trim()) {
          profileData.fullName = data.fullName.trim();
        }
        if (data.phoneNumber && data.phoneNumber.trim()) {
          profileData.phoneNumber = data.phoneNumber.trim();
        }
        if (data.profilePicture) {
          profileData.profilePicture = data.profilePicture;
        }
        

        
        const response = await profileApi.updateProfile(profileData);
        return response.data;
      }
    },
    onMutate: () => {
      clearError();
    },
    onSuccess: (updatedUser: User) => {


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
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      const response = await profileApi.getProfile();
      return response.data.data;
    },
    onSuccess: (userData: User) => {


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
