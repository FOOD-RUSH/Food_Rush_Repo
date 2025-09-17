import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TokenManager from '@/src/services/tokenManager';
import { apiClient } from '@/src/services/apiClient';

// Simple User interface
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'customer' | 'restaurant';
  isVerified?: boolean;
  restaurantId?: string;
  verificationStatus?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PENDING_VERIFICATION';
}

// Auth Store State
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  _isInitializing: boolean; // Internal flag to prevent concurrent initialization
}

// Auth Store Actions
interface AuthActions {
  // Core auth
  login: (email: string, password: string, userType: 'customer' | 'restaurant') => Promise<boolean>;
  logout: () => Promise<void>;
  
  // State management
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Initialization
  initialize: () => Promise<void>;
}

const initialState: Omit<AuthState, '_isInitializing'> = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isInitialized: false,
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      _isInitializing: false,

      // Initialize auth on app start
      initialize: async () => {
        const state = get();
        
        // Prevent multiple initialization calls
        if (state.isInitialized || state._isInitializing) {
          return;
        }

        try {
          set({ _isInitializing: true, isLoading: true });
          
          const tokenData = await TokenManager.getTokenData();
          
          if (!tokenData?.accessToken) {
            set({ 
              isAuthenticated: false, 
              user: null, 
              isLoading: false,
              isInitialized: true,
              _isInitializing: false,
              error: null,
            });
            return;
          }

          // Validate token with backend
          const response = await apiClient.get('/auth/me');
          const user = response.data.data?.user || response.data.user || response.data;
          
          if (!user) {
            throw new Error('Invalid user data received');
          }
          
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            isInitialized: true,
            _isInitializing: false,
            error: null,
          });
        } catch (error: any) {
          console.warn('Auth initialization failed:', error);
          
          // Clear tokens on failure
          try {
            await TokenManager.clearTokens();
          } catch (clearError) {
            console.warn('Failed to clear tokens:', clearError);
          }
          
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            isInitialized: true,
            _isInitializing: false,
            error: null, // Don't show initialization errors to user
          });
        }
      },

      // Login
      login: async (email: string, password: string, userType: 'customer' | 'restaurant') => {
        const state = get();
        
        // Prevent multiple login attempts
        if (state.isLoading) {
          return false;
        }

        try {
          set({ isLoading: true, error: null });

          const response = await apiClient.post('/auth/login', {
            email,
            password,
            userType,
          });

          const { user, accessToken, refreshToken } = response.data.data || response.data;

          if (!user || !accessToken) {
            throw new Error('Invalid login response');
          }

          await TokenManager.setTokens({
            accessToken,
            refreshToken,
            userType,
          });
          
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return true;
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Login failed';
          set({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            error: errorMessage,
          });
          return false;
        }
      },

      // Logout
      logout: async () => {
        const state = get();
        
        // Prevent multiple logout calls or logout when not authenticated
        if (state.isLoading) {
          return;
        }

        try {
          set({ isLoading: true });
          
          // Try to call logout endpoint (optional)
          try {
            if (state.isAuthenticated) {
              await apiClient.post('/auth/logout');
            }
          } catch (apiError) {
            console.warn('Logout API call failed:', apiError);
            // Continue with local logout even if API call fails
          }
          
          // Clear tokens
          await TokenManager.clearTokens();
          
          // Reset to initial state but keep initialization status
          set({ 
            ...initialState,
            isInitialized: true,
            _isInitializing: false,
          });
        } catch (error) {
          console.error('Logout error:', error);
          
          // Force clear tokens and state even on error
          try {
            await TokenManager.clearTokens();
          } catch (clearError) {
            console.warn('Failed to clear tokens during error recovery:', clearError);
          }
          
          set({ 
            ...initialState,
            isInitialized: true,
            _isInitializing: false,
          });
        }
      },

      // Error management
      setError: (error) => {
        const currentState = get();
        if (currentState.error !== error) {
          set({ error });
        }
      },
      
      clearError: () => {
        const currentState = get();
        if (currentState.error !== null) {
          set({ error: null });
        }
      },
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({}), // Don't persist auth state, only tokens via TokenManager
    }
  )
);

// Simple selector hooks
export const useAuth = () => useAuthStore();
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);
export const useAuthInitialized = () => useAuthStore((state) => state.isInitialized);

// Utility hooks
export const useIsCustomer = () => useAuthStore((state) => state.user?.role === 'customer');
export const useIsRestaurant = () => useAuthStore((state) => state.user?.role === 'restaurant');
