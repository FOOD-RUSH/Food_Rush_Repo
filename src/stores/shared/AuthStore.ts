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
  verificationStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
}

// Auth Store State
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
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

const initialState: AuthState = {
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

      // Initialize auth on app start
      initialize: async () => {
        try {
          set({ isLoading: true });
          
          const tokenData = await TokenManager.getTokenData();
          
          if (!tokenData.accessToken) {
            set({ 
              isAuthenticated: false, 
              user: null, 
              isLoading: false,
              isInitialized: true 
            });
            return;
          }

          // Validate token with backend
          const response = await apiClient.get('/auth/me');
          const user = response.data.data?.user || response.data.user || response.data;
          
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            isInitialized: true,
          });
        } catch (error) {
          await TokenManager.clearTokens();
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            isInitialized: true,
            error: 'Authentication failed',
          });
        }
      },

      // Login
      login: async (email: string, password: string, userType: 'customer' | 'restaurant') => {
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
        try {
          set({ isLoading: true });
          
          // Try to call logout endpoint
          try {
            await apiClient.post('/auth/logout');
          } catch (error) {
            console.warn('Logout API call failed');
          }
          
          await TokenManager.clearTokens();
          set({ ...initialState, isInitialized: true });
        } catch (error) {
          console.error('Logout error:', error);
          await TokenManager.clearTokens();
          set({ ...initialState, isInitialized: true });
        }
      },

      // Error management
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
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
