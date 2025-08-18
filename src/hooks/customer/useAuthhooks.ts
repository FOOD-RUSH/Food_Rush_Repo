// useAuthHooks.ts
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { authApi } from "@/src/services/customer/authApi";
import TokenManager from "@/src/services/customer/tokenManager";
import { useAuthStore } from "@/src/stores/customerStores/AuthStore";

const CACHE_CONFIG = {
    STALE_TIME: 5 * 60 * 1000, // 5 minutes
    CACHE_TIME: 10 * 60 * 1000, // 10 minutes
    RETRY_DELAY: 1000,
    MAX_RETRIES: 3,
};

// Auth hooks
export const useCurrentUser = () => {
    return useQuery({
        queryKey: ['auth', 'me'],
        queryFn: () => authApi.getProfile().then(res => res.data),
        staleTime: CACHE_CONFIG.STALE_TIME,
        gcTime: CACHE_CONFIG.CACHE_TIME,
        retry: false,
        enabled: !!useAuthStore.getState().isAuthenticated,
    })
}

export const useLogin = () => {
    const queryClient = useQueryClient();
    const { setUser, setIsAuthenticated, clearError } = useAuthStore();

    return useMutation({
        mutationFn: (credentials: { email: string, password: string }) => authApi.login(credentials),
        onSuccess: async (response) => {
            console.log('Login successful, processing response...');

            try {
                console.log(response.data.data.accessToken);
                const accessToken = response.data.data.accessToken;
                const refreshToken = response.data.data.refreshToken;
                const user = response.data.data.user;

                if (!accessToken || !refreshToken) {
                    console.error('Missing tokens in response:', {
                        hasAccessToken: !!accessToken,
                        hasRefreshToken: !!refreshToken
                    });
                    throw new Error('Invalid response: missing authentication tokens');
                }

                if (!user) {
                    console.error('Missing user data in response');
                    throw new Error('Invalid response: missing user data');
                }

                console.log('Storing tokens...');
                const tokensStored = await TokenManager.setTokens(accessToken, refreshToken);

                if (!tokensStored) {
                    throw new Error('Failed to store authentication tokens');
                }

                console.log('Updating auth state...');
                // Clear any previous errors
                clearError();

                // Update auth state
                setUser(user);
                setIsAuthenticated(true);

                // Cache user data
                queryClient.setQueryData(['auth', 'me'], user);

                // Invalidate and refetch user-dependent queries
                queryClient.invalidateQueries({ queryKey: ['addresses'] });
                queryClient.invalidateQueries({ queryKey: ['orders'] });
                queryClient.invalidateQueries({ queryKey: ['notifications'] });

                console.log('Login process completed successfully');

            } catch (error) {
                console.error('Error in login success handler:', error);
                // Clean up on error
                await TokenManager.clearAllTokens();
                setIsAuthenticated(false);
                setUser(null);
                throw error;
            }
        },
        onError: (error: any) => {
            console.error('Login failed:', error);

            // Clean up auth state on login failure
            setIsAuthenticated(false);
            setUser(null);

            // Clear any stored tokens
            TokenManager.clearAllTokens().catch(console.error);

            // Don't set error in store here, let the component handle it
            // The error will be available via the mutation's error state
        }
    })
}

export const useRegister = () => {
    return useMutation({
        mutationFn: (userData: any) => authApi.register(userData).then((res) => (res.data)),
    })
}

export const useVerifyOTP = () => {
    const queryClient = useQueryClient();
    const { setUser, setIsAuthenticated, clearError } = useAuthStore();

    return useMutation({
        mutationFn: (otpData: any) => authApi.verifyOTP(otpData),
        onSuccess: async (response) => {
            try {
                const { user, accessToken, refreshToken } = response.data;

                if (!accessToken || !refreshToken || !user) {
                    throw new Error('Invalid verification response: missing required data');
                }

                const tokensStored = await TokenManager.setTokens(accessToken, refreshToken);
                if (!tokensStored) {
                    throw new Error('Failed to store authentication tokens');
                }

                clearError();
                setUser(user);
                setIsAuthenticated(true);

                queryClient.setQueryData(['auth', 'me'], user);
                queryClient.invalidateQueries({ queryKey: ['addresses'] });
                queryClient.invalidateQueries({ queryKey: ['orders'] });
                queryClient.invalidateQueries({ queryKey: ['notifications'] });

            } catch (error) {
                console.error('Error in OTP verification success handler:', error);
                await TokenManager.clearAllTokens();
                setIsAuthenticated(false);
                setUser(null);
                throw error;
            }
        },
        onError: (error: any) => {
            console.error('OTP verification failed:', error);
            setIsAuthenticated(false);
            setUser(null);
            TokenManager.clearAllTokens().catch(console.error);
        }
    })
}

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    const { setUser } = useAuthStore();

    return useMutation({
        mutationFn: (userData: any) => authApi.updateProfile(userData),
        onSuccess: (response) => {
            const updatedUser = response.data;
            setUser(updatedUser);
            queryClient.setQueryData(['auth', 'me'], updatedUser);
        }
    })
}

export const useLogout = () => {
    const queryClient = useQueryClient();
    const { logoutUser } = useAuthStore();

    return useMutation({
        mutationFn: () => authApi.logout(),
        onSuccess: async () => {
            await logoutUser();
            queryClient.clear();
        },
        onError: async (error) => {
            console.error('Logout API call failed, but proceeding with local logout:', error);
            await logoutUser();
            queryClient.clear();
        }
    })
}

export const useResendOTP = () => {
    return useMutation({
        mutationFn: (email: string) => authApi.resendVerification(email),
    })
}

export const useResetPassword = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ otp, email, newPassword }: { otp: string, email: string, newPassword: string }) =>
            authApi.resetPassword({ email, otp, newPassword }),
        onSuccess: (response) => {
            // Show success toast
            // Note: We'll need to handle the navigation in the component
            console.log('Password reset successful:', response.data?.message || 'Password reset successfully');
        },
        onError: (error: any) => {
            console.error('Password reset failed:', error);
            // Error will be handled by the component
        }
    })
}

export const useRequestPasswordReset = () => {
    return useMutation({
        mutationFn: (data: any) => authApi.requestPasswordReset(data).then((response) => response.data),
    })
}
