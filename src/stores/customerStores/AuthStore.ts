import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../../types';
import { navigate, reset } from '../../navigation/navigationHelpers';
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

            // Clear tokens from storage
            await TokenManager.clearAllTokens();

            // Clear cart store (lazy import to avoid circular dependency)
            try {
              const { useCartStore } = await import('./cartStore');
              useCartStore.getState().clearCart();
            } catch (cartError) {
              console.error('Error clearing cart during logout:', cartError);
            }

            // Reset auth state locally
            set({
              ...initialState,
              selectedUserType: get().selectedUserType, // Preserve selected user type
            });

            // Navigate to user type selection
            reset('UserTypeSelection');
          } catch (error) {
            console.error('Error during logout:', error);
            
            // Fallback: try manual cleanup
            try {
              await TokenManager.clearAllTokens();
            } catch (fallbackError) {
              console.error('Error during fallback cleanup:', fallbackError);
            }

            set({
              ...initialState,
              selectedUserType: get().selectedUserType,
              error: 'Logout completed with some errors',
            });
            reset('UserTypeSelection');
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
export const useUser = () => useAuthStore((state) => state.user);
export const useAuthUser = () => useAuthStore((state) => state.user); // Alias for compatibility
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

// Individual action hooks to prevent object recreation
export const useLogout = () => useAuthStore((state) => state.logoutUser);
export const useSetUser = () => useAuthStore((state) => state.setUser);
export const useSetIsAuthenticated = () => useAuthStore((state) => state.setIsAuthenticated);
export const useSetError = () => useAuthStore((state) => state.setError);
export const useClearError = () => useAuthStore((state) => state.clearError);
export const useResetAuth = () => useAuthStore((state) => state.resetAuth);
export const useSetRegistrationData = () => useAuthStore((state) => state.setRegistrationData);