import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  profileApi,
  UpdateProfileRequest,
} from '@/src/services/shared/profileApi';
import { useAuthStore } from '@/src/stores/AuthStore';
import { User } from '@/src/types';

/**
 * Unified hook for updating user profiles (both customer and restaurant)
 * Uses PATCH /api/v1/auth/profile endpoint
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { setUser, clearError, user } = useAuthStore();

  return useMutation({
    mutationFn: async (data: UpdateProfileRequest) => {
      const response = await profileApi.updateProfile(data);
      return response.data.data;
    },
    onMutate: () => {
      clearError();
    },
    onSuccess: (updatedUser: User) => {
      console.log('✅ Profile updated successfully:', {
        userId: updatedUser.id,
        fullName: updatedUser.fullName,
        phoneNumber: updatedUser.phoneNumber,
        role: updatedUser.role,
        hasProfilePicture: !!updatedUser.profilePicture,
      });

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
      console.log('✅ Profile fetched successfully:', {
        userId: userData.id,
        fullName: userData.fullName,
        role: userData.role,
      });

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
