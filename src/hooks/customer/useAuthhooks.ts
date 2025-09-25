// useAuthHooks.ts
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';
import { authApi } from '@/src/services/customer/authApi';
import {
  OTPCredentials,
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
} from '@/src/services/shared/authTypes';
import TokenManager from '@/src/services/shared/tokenManager';
import {
  useAuthStore,
  useSetAuthData,
  CustomerProfile,
} from '@/src/stores/AuthStore';

const CACHE_CONFIG = {
  STALE_TIME: 5 * 60 * 1000, // 5 minutes
  CACHE_TIME: 10 * 60 * 1000, // 10 minutes
  RETRY_DELAY: 1000,
  MAX_RETRIES: 3,
};

// Auth hooks
export const useCurrentUser = () => {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      try {
        const response = await authApi.getProfile();
        return response.data;
      } catch (error: any) {
        console.error('Failed to fetch user profile:', error);
        throw error;
      }
    },
    staleTime: CACHE_CONFIG.STALE_TIME,
    gcTime: CACHE_CONFIG.CACHE_TIME,
    retry: (failureCount, error: any) => {
      // Don't retry on auth errors
      if (error?.status === 401 || error?.response?.status === 401) {
        return false;
      }
      // Retry up to 3 times for other errors
      return failureCount < CACHE_CONFIG.MAX_RETRIES;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: isAuthenticated,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};

// Enhanced profile management hook
export const useProfileManager = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  const {
    data: user,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useCurrentUser();

  const refreshProfile = useCallback(async () => {
    try {
      const { data } = await refetch();
      if (data) {
        setUser(data);
        console.log(data);
      }
      return data;
    } catch (error) {
      console.error('Failed to refresh profile:', error);
      throw error;
    }
  }, [refetch, setUser]);

  const invalidateProfile = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
  }, [queryClient]);

  const updateLocalProfile = useCallback(
    (updatedData: Partial<any>) => {
      queryClient.setQueryData(['auth', 'me'], (oldData: any) => ({
        ...oldData,
        ...updatedData,
      }));

      // Also update the auth store
      const currentUser = queryClient.getQueryData(['auth', 'me']);
      if (currentUser) {
        setUser({ currentUser });
      }
    },
    [queryClient, setUser],
  );

  return {
    user,
    isLoading,
    error,
    isRefetching,
    refreshProfile,
    invalidateProfile,
    updateLocalProfile,
    hasProfile: !!user,
    isProfileStale: error?.status === 401,
  };
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const setAuthData = useSetAuthData();
  const { clearError } = useAuthStore();

  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const response = await authApi.login(credentials);
      return response.data.data;
    },
    onMutate: () => {
      clearError();
    },
    onSuccess: async (data) => {
      console.log('Customer login successful, processing response...');

      const { user, accessToken, refreshToken } = data;

      if (!accessToken || !refreshToken || !user) {
        throw new Error('Invalid response: missing required data');
      }

      // Set auth data using the simplified store method
      await setAuthData({
        user: user as CustomerProfile,
        accessToken,
        refreshToken,
      });

      // Cache user data
      queryClient.setQueryData(['auth', 'me'], user);

      // Invalidate and refetch user-dependent queries
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });

      console.log('Customer login process completed successfully');
    },
    onError: (error: any) => {
      console.error('Customer login failed:', error);
      // Clear any stored tokens
      TokenManager.clearAllTokens().catch(console.error);
    },
  });
};

export const useRegister = () => {
  const { clearError } = useAuthStore();

  return useMutation({
    mutationFn: async (userData: RegisterRequest) => {
      const response = await authApi.register(userData);
      return response.data.data;
    },
    onMutate: () => {
      clearError();
    },
    onSuccess: (data) => {
      console.log('Customer registration successful:', data);
      // Registration data can be handled locally in components if needed
    },
  });
};

export const useVerifyOTP = () => {
  const queryClient = useQueryClient();
  const setAuthData = useSetAuthData();
  const { clearError } = useAuthStore();

  return useMutation({
    mutationFn: async (otpData: OTPCredentials) => {
      const response = await authApi.verifyOTP(otpData);
      return response.data.data;
    },
    onMutate: () => {
      clearError();
    },
    onSuccess: async (data) => {
      const { user, accessToken, refreshToken } = data;
      console.log('Customer OTP verification successful');

      if (!accessToken || !refreshToken || !user) {
        throw new Error('Invalid verification response: missing required data');
      }

      // Set auth data using the simplified store method
      await setAuthData({
        user: user as CustomerProfile,
        accessToken,
        refreshToken,
      });

      queryClient.setQueryData(['auth', 'me'], user);
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error: any) => {
      console.error('Customer OTP verification failed:', error);
      TokenManager.clearAllTokens().catch(console.error);
    },
  });
};

// Deprecated: Use useUpdateProfile from '@/src/hooks/shared/useProfileUpdate' instead
// This hook is kept for backward compatibility
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { setUser, clearError } = useAuthStore();

  return useMutation({
    mutationFn: async (userData: UpdateProfileRequest) => {
      const response = await authApi.updateProfile(userData);
      return response.data.data;
    },
    onMutate: () => {
      clearError();
    },
    onSuccess: (updatedUser: CustomerProfile) => {
      console.log('Customer profile updated successfully (legacy hook)');
      // Update user in store
      setUser(updatedUser);

      // Update cached data
      queryClient.setQueryData(['auth', 'me'], updatedUser);
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
};

export const useCustomerLogout = () => {
  const queryClient = useQueryClient();
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: async () => {
      await logout();
      return Promise.resolve();
    },
    onSuccess: () => {
      console.log('Customer logout completed successfully');
      // Clear all cached data
      queryClient.clear();
    },
    onError: (error) => {
      console.error('Customer logout error:', error);
      // Clear cached data even on error
      queryClient.clear();
    },
  });
};

export const useResendOTP = () => {
  const { clearError } = useAuthStore();

  return useMutation({
    mutationFn: async (email: string) => {
      const response = await authApi.resendVerification(email);
      return response.data;
    },
    onMutate: () => {
      clearError();
    },
    onSuccess: () => {
      console.log('Customer OTP resent successfully');
    },
  });
};

export const useResetPassword = () => {
  const { clearError } = useAuthStore();

  return useMutation({
    mutationFn: async (data: ChangePasswordRequest) => {
      const response = await authApi.resetPassword(data);
      return response.data;
    },
    onMutate: () => {
      clearError();
    },
    onSuccess: (response) => {
      console.log(
        'Customer password reset successful:',
        response?.message || 'Password reset successfully',
      );
    },
  });
};

export const useRequestPasswordReset = () => {
  const { clearError } = useAuthStore();

  return useMutation({
    mutationFn: async (data: ResetPasswordRequest) => {
      const response = await authApi.requestPasswordReset(data);
      return response.data;
    },
    onMutate: () => {
      clearError();
    },
    onSuccess: () => {
      console.log('Customer password reset request sent successfully');
    },
  });
};
