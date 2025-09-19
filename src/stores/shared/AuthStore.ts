import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TokenManager from '../../services/shared/tokenManager';
import { apiClient } from '../../services/shared/apiClient';
import { 
  User, 
  Restaurant, 
  AuthResponse, 
  isRestaurantAuthResponse 
} from '../../types';

// Re-export User type for backward compatibility
export type { User } from '../../types';

// Auth Store State
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  // Restaurant-specific state
  restaurants?: Restaurant[];
  defaultRestaurantId?: string;
}

// Auth Store Actions
interface AuthActions {
  // Core auth
  login: (email: string, password: string, userType: 'customer' | 'restaurant') => Promise<boolean>;
  logout: () => Promise<void>;
  
  // State management
  setError: (error: string | null) => void;
  clearError: () => void;
  setUser: (user: User) => void;
  setAuthData: (authResponse: AuthResponse) => void;
  
  // Restaurant-specific actions
  setRestaurants: (restaurants: Restaurant[]) => void;
  setDefaultRestaurantId: (restaurantId: string) => void;
  getCurrentRestaurant: () => Restaurant | null;
  
  // Initialization
  initialize: () => Promise<void>;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isInitialized: false,
  restaurants: undefined,
  defaultRestaurantId: undefined,
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Initialize auth on app start
      initialize: async () => {
        try {
          set({ isLoading: true });
          
          const accessToken = await TokenManager.getToken();
          
          if (!accessToken) {
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
          await TokenManager.clearAllTokens();
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

          // Use different endpoints for customer vs restaurant
          const endpoint = userType === 'restaurant' ? '/restaurants/auth/login' : '/auth/login';
          
          const response = await apiClient.post(endpoint, {
            email,
            password,
            ...(userType === 'customer' && { userType }), // Only add userType for customer endpoint
          });

          const authData = response.data.data || response.data;
          const { user, accessToken, refreshToken } = authData;

          if (!user || !accessToken) {
            throw new Error('Invalid login response');
          }

          await TokenManager.setTokens(
            accessToken,
            refreshToken
          );
          
          // Handle restaurant-specific data
          if (userType === 'restaurant' && isRestaurantAuthResponse(authData)) {
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
              restaurants: authData.restaurants,
              defaultRestaurantId: authData.defaultRestaurantId,
            });
          } else {
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
              restaurants: undefined,
              defaultRestaurantId: undefined,
            });
          }

          return true;
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Login failed';
          set({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            error: errorMessage,
            restaurants: undefined,
            defaultRestaurantId: undefined,
          });
          return false;
        }
      },

      // Logout
      logout: async () => {
        try {
          await TokenManager.clearAllTokens();
          set({ ...initialState, isInitialized: true });
        } catch (error) {
          console.error('Logout error:', error);
          await TokenManager.clearAllTokens();
          set({ ...initialState, isInitialized: true });
        }
      },

      // State management
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
      setUser: (user) => set({ user }),
      setAuthData: (authResponse) => {
        if (isRestaurantAuthResponse(authResponse)) {
          set({
            user: authResponse.user,
            restaurants: authResponse.restaurants,
            defaultRestaurantId: authResponse.defaultRestaurantId,
          });
        } else {
          set({
            user: authResponse.user,
            restaurants: undefined,
            defaultRestaurantId: undefined,
          });
        }
      },
      
      // Restaurant-specific actions
      setRestaurants: (restaurants) => set({ restaurants }),
      setDefaultRestaurantId: (restaurantId) => set({ defaultRestaurantId: restaurantId }),
      getCurrentRestaurant: () => {
        const state = get();
        if (!state.restaurants || !state.defaultRestaurantId) {
          return null;
        }
        return state.restaurants.find(r => r.id === state.defaultRestaurantId) || null;
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

// Restaurant-specific selector hooks
export const useRestaurants = () => useAuthStore((state) => state.restaurants);
export const useDefaultRestaurantId = () => useAuthStore((state) => state.defaultRestaurantId);
export const useCurrentRestaurant = () => useAuthStore((state) => state.getCurrentRestaurant());

// Utility hooks
export const useIsCustomer = () => useAuthStore((state) => state.user?.role === 'customer');
export const useIsRestaurant = () => useAuthStore((state) => state.user?.role === 'restaurant');

// Combined restaurant info hook
export const useRestaurantInfo = () => {
  const restaurants = useRestaurants();
  const defaultRestaurantId = useDefaultRestaurantId();
  const currentRestaurant = useCurrentRestaurant();
  const isRestaurant = useIsRestaurant();
  
  return {
    restaurants,
    defaultRestaurantId,
    currentRestaurant,
    isRestaurant,
    hasRestaurants: !!restaurants && restaurants.length > 0,
  };
};
