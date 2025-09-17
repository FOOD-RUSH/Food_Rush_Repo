import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../../types';
import { reset } from '../../navigation/navigationHelpers';
import TokenManager from '@/src/services/shared/tokenManager';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  userType: 'customer' | 'restaurant' | null;
  selectedUserType: 'customer' | 'restaurant' | null;
  error: string | null;
  // Add registration state for better UX
  registrationData: {
    email?: string;
    phoneNumber?: string;
    userId?: string;
  } | null;
}

interface AuthActions {
  // State setters
  setUser: (user: User | null) => void;
  setIsAuthenticated: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedUserType: (userType: 'customer' | 'restaurant') => void;
  setRegistrationData: (data: AuthState['registrationData']) => void;

  // Authentication actions
  logoutUser: () => Promise<void>;

  // Utility actions
  clearError: () => void;
  resetAuth: () => void;

  // Auth status checkers
  checkAuthStatus: () => Promise<void>;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  userType: null,
  selectedUserType: null,
  error: null,
  registrationData: null,
};

export const useAuthStore = create<AuthState & AuthActions>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // State setters
        setUser: (user) => {
          set({
            user,
            userType: user?.role as 'customer' | 'restaurant' | null,
            error: null, // Clear error on successful user set
          });
        },

        setIsAuthenticated: (isAuthenticated) => {
          set({
            isAuthenticated,
            error: isAuthenticated ? null : get().error, // Only clear error on successful auth
          });
        },

        setIsLoading: (isLoading) => set({ isLoading }),

        setError: (error) => set({ error }),

        setSelectedUserType: (selectedUserType) => set({ selectedUserType }),

        setRegistrationData: (registrationData) => set({ registrationData }),

        // Authentication actions
        logoutUser: async () => {
          try {
            set({ isLoading: true });

            // Use the centralized app reset utility
            const { performCompleteAppReset } = await import('../../utils/appReset');
            const result = await performCompleteAppReset({
              preserveOnboarding: true,
              preserveUserTypeSelection: true,
              navigateToAuth: true,
            });

            if (result.success) {
              // Reset auth state locally
              set({
                ...initialState,
                selectedUserType: get().selectedUserType, // Preserve selected user type
              });
            } else {
              throw new Error('App reset failed');
            }
          } catch (error) {
            console.error('Error during logout:', error);
            
            // Fallback: try manual cleanup
            try {
              await TokenManager.clearAllTokens();
              const { useCartStore } = await import('./cartStore');
              useCartStore.getState().clearCart();
            } catch (fallbackError) {
              console.error('Error during fallback cleanup:', fallbackError);
            }

            set({
              ...initialState,
              selectedUserType: get().selectedUserType,
              error: 'Logout completed with some errors',
            });
            reset('Auth');
          } finally {
            set({ isLoading: false });
          }
        },

        // Check authentication status on app start
        checkAuthStatus: async () => {
          try {
            set({ isLoading: true });

            const accessToken = await TokenManager.getToken();
            const refreshToken = await TokenManager.getRefreshToken();

            if (accessToken && refreshToken) {
              // Token exists, but we need to verify it's valid
              // This will be handled by the API interceptor
              set({ isAuthenticated: true });
            } else {
              // No tokens found
              set({
                isAuthenticated: false,
                user: null,
                userType: null,
              });
            }
          } catch (error) {
            console.error('Error checking auth status:', error);
            set({
              isAuthenticated: false,
              user: null,
              userType: null,
            });
          } finally {
            set({ isLoading: false });
          }
        },

        // Utility actions
        clearError: () => set({ error: null }),

        resetAuth: () => {
          set({
            ...initialState,
            selectedUserType: get().selectedUserType, // Preserve selected user type
          });
        },
      }),
      {
        name: 'auth-storage',
        storage: createJSONStorage(() => AsyncStorage),
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          userType: state.userType,
          selectedUserType: state.selectedUserType,
          registrationData: state.registrationData,
          // Don't persist loading and error states
        }),
        version: 2, // Increment version to handle schema changes
        migrate: (persistedState: any, version: number) => {
          // Handle migration from older versions
          if (version < 2) {
            return {
              ...persistedState,
              registrationData: null,
              error: null,
              isLoading: false,
            };
          }
          return persistedState;
        },
        onRehydrateStorage: () => (state) => {
          // Check auth status when store is rehydrated
          if (state) {
            state.checkAuthStatus();
          }
        },
      },
    ),
    { name: 'AuthStore' },
  ),
);

// Selector hooks for better performance and type safety
export const useAuthUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);
export const useUserType = () => useAuthStore((state) => state.userType);
export const useSelectedUserType = () =>
  useAuthStore((state) => state.selectedUserType);
export const useRegistrationData = () =>
  useAuthStore((state) => state.registrationData);

// Compound selectors for complex state combinations
export const useAuthStatus = () =>
  useAuthStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    user: state.user,
    error: state.error,
  }));

export const useAuthActions = () =>
  useAuthStore((state) => ({
    setUser: state.setUser,
    setIsAuthenticated: state.setIsAuthenticated,
    setError: state.setError,
    clearError: state.clearError,
    logoutUser: state.logoutUser,
    resetAuth: state.resetAuth,
    setRegistrationData: state.setRegistrationData,
  }));