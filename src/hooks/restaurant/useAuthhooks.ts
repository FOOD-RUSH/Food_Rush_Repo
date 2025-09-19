import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  restaurantAuthApi,
  RestaurantRegisterRequest,
  RestaurantLoginResponse,
} from '@/src/services/restaurant/authApi';
import { useAuthStore } from '@/src/stores/shared/AuthStore';
import TokenManager from '@/src/services/shared/tokenManager';

export const useRegisterRestaurant = () => {
  return useMutation({
    mutationFn: (userData: RestaurantRegisterRequest) =>
      restaurantAuthApi.register(userData).then((res) => res.data),
  });
};

export const useLoginRestaurant = () => {
  const queryClient = useQueryClient();
  const { setUser, setAuthData, setError, clearError } = useAuthStore();

  return useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      restaurantAuthApi.login(credentials),
    onSuccess: async (response) => {
      console.log('🍽️ Restaurant Login Success - Processing response...');
      
      try {
        const responseData = response.data as RestaurantLoginResponse;
        const { user, accessToken, refreshToken, restaurants, defaultRestaurantId } = responseData.data;

        if (!accessToken || !refreshToken) {
          console.error('Missing tokens in restaurant login response:', {
            hasAccessToken: !!accessToken,
            hasRefreshToken: !!refreshToken,
          });
          throw new Error('Invalid response: missing authentication tokens');
        }

        if (!user) {
          console.error('Missing user data in restaurant login response');
          throw new Error('Invalid response: missing user data');
        }

        console.log('Storing restaurant tokens...');
        const tokensStored = await TokenManager.setTokens(
          accessToken,
          refreshToken
        );

        if (!tokensStored) {
          throw new Error('Failed to store authentication tokens');
        }

        console.log('Updating restaurant auth state...');
        // Clear any previous errors
        clearError();

        // Set auth data with restaurant-specific information
        setAuthData({
          user,
          accessToken,
          refreshToken,
          restaurants,
          defaultRestaurantId,
        });

        // Cache user data
        queryClient.setQueryData(['auth', 'me'], user);

        // Invalidate restaurant-specific queries
        queryClient.invalidateQueries({ queryKey: ['restaurant'] });
        queryClient.invalidateQueries({ queryKey: ['orders'] });
        queryClient.invalidateQueries({ queryKey: ['menu'] });
        queryClient.invalidateQueries({ queryKey: ['notifications'] });

        console.log('🍽️ Restaurant login process completed successfully');
      } catch (error) {
        console.error('Error in restaurant login success handler:', error);
        // Clean up on error
        await TokenManager.clearAllTokens();
        setError('Login failed');
        throw error;
      }
    },
    onError: (error: any) => {
      console.error('🍽️ Restaurant login failed:', error);
      
      // Clean up auth state on login failure
      setError(error.response?.data?.message || 'Restaurant login failed');
      
      // Clear any stored tokens
      TokenManager.clearAllTokens().catch(console.error);
    },
  });
};

export const useVerifyRestaurantOTP = () => {
  return useMutation({
    mutationFn: (otpData: { userId: string; otp: string; type: 'email' }) =>
      restaurantAuthApi.verifyOTP(otpData),
  });
};

export const useLogoutRestaurant = () => {
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      console.log('Performing restaurant logout - clearing storage and state');
      await logout();
      return Promise.resolve();
    },
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();
      console.log('🍽️ Restaurant logout completed successfully');
    },
    onError: (error) => {
      console.error('🍽️ Restaurant logout error:', error);
      // Force logout even if there's an error
      logout();
      queryClient.clear();
    },
  });
};

export const useUpdateRestaurantProfile = () => {
  return useMutation({
    mutationFn: (userData: any) => restaurantAuthApi.updateProfile(userData),
  });
};

export const useResetRestaurantPassword = () => {
  return useMutation({
    mutationFn: ({
      otp,
      email,
      newPassword,
    }: {
      otp: string;
      email: string;
      newPassword: string;
    }) => restaurantAuthApi.resetPassword({ email, otp, newPassword }),
  });
};

export const useRequestRestaurantPasswordReset = () => {
  return useMutation({
    mutationFn: (data: any) =>
      restaurantAuthApi
        .requestPasswordReset(data)
        .then((response) => response.data),
  });
};
