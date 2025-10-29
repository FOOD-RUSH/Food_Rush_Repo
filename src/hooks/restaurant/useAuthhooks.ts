import { useMutation, useQueryClient } from '@tanstack/react-query';
import { restaurantAuthApi } from '@/src/services/restaurant/authApi';
import { RestaurantRegisterRequest } from '@/src/services/shared/authTypes';
import {
  RestaurantProfile,
  useAuthStore,
  useSetAuthData,
} from '@/src/stores/AuthStore';
import TokenManager from '@/src/services/shared/tokenManager';

export const useRegisterRestaurant = () => {
  const { clearError } = useAuthStore();

  return useMutation({
    mutationFn: async (userData: RestaurantRegisterRequest) => {
      const response = await restaurantAuthApi.register(userData);
      return response.data.data;
    },
    onMutate: () => {
      clearError();
    },
    onSuccess: (data) => {},
  });
};

export const useLoginRestaurant = () => {
  const queryClient = useQueryClient();
  const setAuthData = useSetAuthData();
  const { clearError } = useAuthStore();

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await restaurantAuthApi.login(credentials);
      return response.data.data;
    },
    onMutate: () => {
      clearError();
    },
    onSuccess: async (data) => {
      const {
        user,
        accessToken,
        refreshToken,
        restaurants,
        defaultRestaurantId,
      } = data;

      if (!accessToken || !refreshToken || !user) {
        throw new Error('Invalid response: missing required data');
      }

      // Set auth data using the simplified store method
      await setAuthData({
        user: user as RestaurantProfile,
        accessToken,
        refreshToken,
        restaurants,
        defaultRestaurantId,
      });

      // Immediately fetch full profile (to include profilePicture)
      try {
        const profileRes = await restaurantAuthApi.getProfile();
        const fullUser = profileRes.data.data as RestaurantProfile;
        // Update cache and store
        queryClient.setQueryData(['auth', 'me'], fullUser);
        const { useAuthStore } = await import('@/src/stores/AuthStore');
        useAuthStore.getState().setUser(fullUser);
      } catch (e) {
        console.warn('Fetching full profile after restaurant login failed, using basic user from login.', e);
        // Cache basic user as fallback
        queryClient.setQueryData(['auth', 'me'], user);
      }

      // Invalidate restaurant-specific queries
      queryClient.invalidateQueries({ queryKey: ['restaurant'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['menu'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error: any) => {
      console.error('🍽️ Restaurant login failed:', error);
      // Clear any stored tokens
      TokenManager.clearAllTokens().catch(console.error);
    },
  });
};

export const useVerifyRestaurantOTP = () => {
  const queryClient = useQueryClient();
  const setAuthData = useSetAuthData();
  const { clearError } = useAuthStore();

  return useMutation({
    mutationFn: async (otpData: {
      userId: string;
      otp: string;
      type: 'email';
    }) => {
      const response = await restaurantAuthApi.verifyOTP(otpData);
      return response.data;
    },
    onMutate: () => {
      clearError();
    },
    onSuccess: async (data: any) => {
      // Store tokens if provided
      if (data.accessToken && data.refreshToken && data.user) {
        // Set auth data using the simplified store method
        await setAuthData({
          user: data.user as RestaurantProfile,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          restaurants: data.restaurants,
          defaultRestaurantId: data.defaultRestaurantId,
        });

        // Cache user data
        queryClient.setQueryData(['auth', 'me'], data.user);
        queryClient.invalidateQueries({ queryKey: ['restaurant'] });
        queryClient.invalidateQueries({ queryKey: ['orders'] });
        queryClient.invalidateQueries({ queryKey: ['menu'] });
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      }
    },
    onError: (error: any) => {
      console.error('Restaurant OTP verification failed:', error);
      TokenManager.clearAllTokens().catch(console.error);
    },
  });
};

export const useRestaurantLogout = () => {
  const queryClient = useQueryClient();
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: async () => {
      await logout();
      return Promise.resolve();
    },
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();
    },
    onError: (error) => {
      console.error('🍽️ Restaurant logout error:', error);
      // Clear cached data even on error
      queryClient.clear();
    },
  });
};

export const useResetRestaurantPassword = () => {
  const { clearError } = useAuthStore();

  return useMutation({
    mutationFn: async (data: {
      otp: string;
      email: string;
      newPassword: string;
    }) => {
      const response = await restaurantAuthApi.resetPassword(data);
      return response.data;
    },
    onMutate: () => {
      clearError();
    },
    onSuccess: (response) => {},
  });
};

export const useRequestRestaurantPasswordReset = () => {
  const { clearError } = useAuthStore();

  return useMutation({
    mutationFn: async (data: { email: string }) => {
      const response = await restaurantAuthApi.requestPasswordReset(data);
      return response.data;
    },
    onMutate: () => {
      clearError();
    },
    onSuccess: () => {},
  });
};
