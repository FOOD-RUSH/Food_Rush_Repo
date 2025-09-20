import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigate, reset } from '../navigation/navigationHelpers';
import TokenManager from '../services/shared/tokenManager';

// User profiles for different user types
export interface CustomerProfile {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  role: 'customer';
  status: 'active' | 'inactive' | 'suspended';
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  // Customer-specific fields
  address?: string;
  dateOfBirth?: string;
  preferences?: {
    notifications: boolean;
    marketing: boolean;
    language: string;
  };
}

export interface RestaurantProfile {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  role: 'restaurant';
  status: 'active' | 'inactive' | 'pending_verification' | 'suspended';
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  // Restaurant-specific fields
  businessName?: string;
  businessAddress?: string;
  businessPhone?: string;
  businessLicense?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  phone?: string;
  isOpen: boolean;
  latitude?: number;
  longitude?: number;
  verificationStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  documentUrl?: string;
  rating?: number;
  ratingCount: number;
  ownerId: string;
  menuMode: 'FIXED' | 'DYNAMIC';
  timezone: string;
  deliveryBaseFee?: number;
  deliveryPerKmRate?: number;
  deliveryMinFee?: number;
  deliveryMaxFee?: number;
  deliveryFreeThreshold?: number;
  deliverySurgeMultiplier?: number;
  createdAt: string;
  updatedAt: string;
}

export type UserProfile = CustomerProfile | RestaurantProfile;

interface AuthState {
  // Core auth state
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Restaurant-specific state (only for restaurant users)
  restaurants: Restaurant[];
  defaultRestaurantId: string | null;
}

interface AuthActions {
  // State setters - to be called after successful API responses
  setAuthData: (data: {
    user: UserProfile;
    accessToken: string;
    refreshToken: string;
    restaurants?: Restaurant[];
    defaultRestaurantId?: string;
  }) => Promise<void>;
  
  setUser: (user: UserProfile | null) => void;
  setIsAuthenticated: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  setError: (error: string | null) => void;
  setRestaurants: (restaurants: Restaurant[]) => void;
  setDefaultRestaurantId: (restaurantId: string) => void;
  
  // Utility actions
  logout: () => Promise<void>;
  clearError: () => void;
  resetAuth: () => void;
  checkAuthStatus: () => Promise<void>;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  restaurants: [],
  defaultRestaurantId: null,
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Check if user is authenticated based on stored tokens
      checkAuthStatus: async () => {
        try {
          const token = await TokenManager.getToken();
          const refreshToken = await TokenManager.getRefreshToken();
          
          if (token && refreshToken) {
            set({ isAuthenticated: true });
          } else {
            set({ isAuthenticated: false, user: null });
          }
        } catch (error) {
          console.error('Error checking auth status:', error);
          set({ isAuthenticated: false, user: null });
        }
      },

      // Set authentication data after successful login/signup
      setAuthData: async (data) => {
        try {
          // Store tokens
          await TokenManager.setTokens(data.accessToken, data.refreshToken);
          
          // Update state
          const newState: Partial<AuthState> = {
            user: data.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          };

          // Handle restaurant-specific data
          if (data.user.role === 'restaurant' && data.restaurants) {
            newState.restaurants = data.restaurants;
            newState.defaultRestaurantId = data.defaultRestaurantId || null;
            
            // Initialize restaurant profile store for new login session
            try {
              const { useRestaurantProfileStore } = await import('./restaurantStores/restaurantProfileStore');
              const profileStore = useRestaurantProfileStore.getState();
              
              // Reset profile loading status for new login
              profileStore.reset();
              
              // If we have restaurant data from login, extract and store basic info
              if (data.restaurants.length > 0 && data.defaultRestaurantId) {
                const defaultRestaurant = data.restaurants.find(r => r.id === data.defaultRestaurantId);
                if (defaultRestaurant) {
                  // Map the basic restaurant data to detailed profile structure
                  // This will be updated with full details when account screen is visited
                  const basicProfile = {
                    id: defaultRestaurant.id,
                    name: defaultRestaurant.name,
                    address: defaultRestaurant.address,
                    phone: defaultRestaurant.phone,
                    isOpen: defaultRestaurant.isOpen,
                    latitude: defaultRestaurant.latitude,
                    longitude: defaultRestaurant.longitude,
                    verificationStatus: defaultRestaurant.verificationStatus,
                    documentUrl: defaultRestaurant.documentUrl,
                    rating: defaultRestaurant.rating,
                    ratingCount: defaultRestaurant.ratingCount,
                    ownerId: defaultRestaurant.ownerId,
                    menuMode: defaultRestaurant.menuMode,
                    timezone: defaultRestaurant.timezone,
                    deliveryBaseFee: defaultRestaurant.deliveryBaseFee,
                    deliveryPerKmRate: defaultRestaurant.deliveryPerKmRate,
                    deliveryMinFee: defaultRestaurant.deliveryMinFee,
                    deliveryMaxFee: defaultRestaurant.deliveryMaxFee,
                    deliveryFreeThreshold: defaultRestaurant.deliveryFreeThreshold,
                    deliverySurgeMultiplier: defaultRestaurant.deliverySurgeMultiplier,
                    createdAt: defaultRestaurant.createdAt,
                    updatedAt: defaultRestaurant.updatedAt,
                  };
                  
                  // Store basic profile data from login
                  profileStore.updateRestaurantProfile(basicProfile);
                }
              }
            } catch (profileError) {
              console.error('Error initializing restaurant profile store:', profileError);
            }
          } else {
            newState.restaurants = [];
            newState.defaultRestaurantId = null;
          }

          set(newState);
        } catch (error) {
          console.error('Error setting auth data:', error);
          set({ error: 'Failed to save authentication data' });
        }
      },

      // Individual state setters
      setUser: (user) => set({ user }),
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      setRestaurants: (restaurants) => set({ restaurants }),
      setDefaultRestaurantId: (defaultRestaurantId) => set({ defaultRestaurantId }),

      // Simple but complete logout - clear all user data while preserving onboarding
      logout: async () => {
        try {
          set({ isLoading: true });
          
          // Clear authentication tokens
          await TokenManager.clearAllTokens();
          
          // Clear all user stores
          try {
            const [
              { useCartStore },
              { useAddressStore },
              { usePaymentStore },
              { useAppStore },
              { useRestaurantProfileStore },
              { useNotificationStore }
            ] = await Promise.all([
              import('./customerStores/cartStore'),
              import('./customerStores/addressStore'),
              import('./customerStores/paymentStore'),
              import('./AppStore'),
              import('./restaurantStores/restaurantProfileStore'),
              import('./shared/notificationStore')
            ]);
            
            // Clear all user data
            useCartStore.getState().clearCart();
            usePaymentStore.getState().reset();
            
            // Clear addresses
            const addressStore = useAddressStore.getState();
            addressStore.addresses.forEach(address => {
              addressStore.deleteAddress(address.id);
            });
            
            // Clear restaurant profile store
            useRestaurantProfileStore.getState().reset();
            
            // Clear shared notification store
            useNotificationStore.getState().reset();
            
            // Clear user type but keep onboarding status
            useAppStore.getState().clearSelectedUserType();
            
          } catch (storeError) {
            console.error('Error clearing stores:', storeError);
          }
          // Reset auth state
          set({ ...initialState, isLoading: false });
          
          // Navigate to user selection
          setTimeout(() => {
            try {
              reset('UserTypeSelection');
            } catch (navError) {
              navigate('UserTypeSelection');
            }
          }, 100);
          
        } catch (error) {
          console.error('Logout error:', error);
          set({ ...initialState, isLoading: false });
          setTimeout(() => reset('UserTypeSelection'), 100);
        }
      },

      // Utility actions
      clearError: () => set({ error: null }),
      resetAuth: () => set(initialState),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        restaurants: state.restaurants,
        defaultRestaurantId: state.defaultRestaurantId,
      }),
      onRehydrateStorage: () => (state) => {
        state?.checkAuthStatus();
      },
    },
  ),
);

// Optimized selector hooks
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);

// User type selectors
export const useIsCustomer = () => useAuthStore((state) => state.user?.role === 'customer');
export const useIsRestaurant = () => useAuthStore((state) => state.user?.role === 'restaurant');
export const useUserType = () => useAuthStore((state) => state.user?.role || null);

// Customer profile selector
export const useCustomerProfile = () => useAuthStore((state) => 
  state.user?.role === 'customer' ? state.user as CustomerProfile : null
);

// Restaurant profile and data selectors
export const useRestaurantProfile = () => useAuthStore((state) => 
  state.user?.role === 'restaurant' ? state.user as RestaurantProfile : null
);

export const useRestaurants = () => useAuthStore((state) => state.restaurants);
export const useDefaultRestaurantId = () => useAuthStore((state) => state.defaultRestaurantId);

export const useCurrentRestaurant = () => useAuthStore((state) => {
  if (!state.defaultRestaurantId || state.restaurants.length === 0) return null;
  return state.restaurants.find(r => r.id === state.defaultRestaurantId) || null;
});

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
    hasRestaurants: restaurants.length > 0,
  };
};

// Action hooks
export const useSetAuthData = () => useAuthStore((state) => state.setAuthData);
export const useLogout = () => useAuthStore((state) => state.logout);
export const useSetUser = () => useAuthStore((state) => state.setUser);
export const useSetIsAuthenticated = () => useAuthStore((state) => state.setIsAuthenticated);
export const useSetIsLoading = () => useAuthStore((state) => state.setIsLoading);
export const useSetError = () => useAuthStore((state) => state.setError);
export const useClearError = () => useAuthStore((state) => state.clearError);
export const useResetAuth = () => useAuthStore((state) => state.resetAuth);

// Backward compatibility
export const useAuth = () => useAuthStore();
export const useAuthUser = () => useUser();

// Export types for use in other files
export type { UserProfile, CustomerProfile, RestaurantProfile, Restaurant };