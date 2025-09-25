import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// New detailed restaurant profile interface based on API response
export interface DetailedRestaurantProfile {
  id: string;
  name: string;
  address: string;
  phone: string | null;
  isOpen: boolean;
  latitude: number | null;
  longitude: number | null;
  deliveryRadius: number | null;
  verificationStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  documentUrl: string | null;
  rating: number | null;
  ratingCount: number;
  ownerId: string;
  menuMode: 'FIXED' | 'DYNAMIC';
  timezone: string;
  deliveryBaseFee: number | null;
  deliveryPerKmRate: number | null;
  deliveryMinFee: number | null;
  deliveryMaxFee: number | null;
  deliveryFreeThreshold: number | null;
  deliverySurgeMultiplier: number | null;
  createdAt: string;
  updatedAt: string;
}

interface RestaurantProfileState {
  // Restaurant profile data
  restaurantProfile: DetailedRestaurantProfile | null;

  // Loading states
  isLoading: boolean;
  isUpdating: boolean;

  // Error handling
  error: string | null;

  // Session tracking
  hasLoadedProfile: boolean;
}

interface RestaurantProfileActions {
  // Fetch restaurant profile from API
  fetchRestaurantProfile: (restaurantId: string) => Promise<void>;

  // Update restaurant profile data
  updateRestaurantProfile: (profile: DetailedRestaurantProfile) => void;

  // Update specific fields
  updateIsOpen: (isOpen: boolean) => void;
  updateRestaurantField: (
    field: keyof DetailedRestaurantProfile,
    value: any,
  ) => void;

  // Session management
  markProfileAsLoaded: () => void;

  // State management
  setLoading: (loading: boolean) => void;
  setUpdating: (updating: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Reset store
  reset: () => void;
}

const initialState: RestaurantProfileState = {
  restaurantProfile: null,
  isLoading: false,
  isUpdating: false,
  error: null,
  hasLoadedProfile: false,
};

export const useRestaurantProfileStore = create<
  RestaurantProfileState & RestaurantProfileActions
>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        fetchRestaurantProfile: async (restaurantId: string) => {
          try {
            set({ isLoading: true, error: null });

            // Import API client dynamically to avoid circular dependencies
            const { apiClient } = await import(
              '@/src/services/shared/apiClient'
            );

            const response = await apiClient.get(
              `/restaurants/${restaurantId}`,
            );

            if (response.data.status_code === 200) {
              const profileData = response.data
                .data as DetailedRestaurantProfile;

              set({
                restaurantProfile: profileData,
                hasLoadedProfile: true,
                isLoading: false,
                error: null,
              });
            } else {
              throw new Error(
                response.data.message || 'Failed to fetch restaurant profile',
              );
            }
          } catch (error: any) {
            console.error('Error fetching restaurant profile:', error);
            set({
              error: error.message || 'Failed to fetch restaurant profile',
              isLoading: false,
            });
            throw error;
          }
        },

        updateRestaurantProfile: (profile: DetailedRestaurantProfile) => {
          set({
            restaurantProfile: profile,
            hasLoadedProfile: true,
            error: null,
          });
        },

        updateIsOpen: (isOpen: boolean) => {
          const { restaurantProfile } = get();
          if (restaurantProfile) {
            set({
              restaurantProfile: {
                ...restaurantProfile,
                isOpen,
                updatedAt: new Date().toISOString(),
              },
            });
          }
        },

        updateRestaurantField: (
          field: keyof DetailedRestaurantProfile,
          value: any,
        ) => {
          const { restaurantProfile } = get();
          if (restaurantProfile) {
            set({
              restaurantProfile: {
                ...restaurantProfile,
                [field]: value,
                updatedAt: new Date().toISOString(),
              },
            });
          }
        },

        markProfileAsLoaded: () => {
          set({ hasLoadedProfile: true });
        },

        setLoading: (isLoading: boolean) => set({ isLoading }),
        setUpdating: (isUpdating: boolean) => set({ isUpdating }),
        setError: (error: string | null) => set({ error }),
        clearError: () => set({ error: null }),

        reset: () => set(initialState),
      }),
      {
        name: 'restaurant-profile-storage',
        storage: createJSONStorage(() => AsyncStorage),
        partialize: (state) => ({
          // Persist restaurant profile
          restaurantProfile: state.restaurantProfile,
          // Don't persist hasLoadedProfile - should reload on app restart
        }),
        version: 1,
      },
    ),
    { name: 'RestaurantProfileStore' },
  ),
);

// Selector hooks for better performance
export const useRestaurantProfileData = () =>
  useRestaurantProfileStore((state) => state.restaurantProfile);

export const useRestaurantProfileLoading = () =>
  useRestaurantProfileStore((state) => state.isLoading);

export const useRestaurantProfileUpdating = () =>
  useRestaurantProfileStore((state) => state.isUpdating);

export const useRestaurantProfileError = () =>
  useRestaurantProfileStore((state) => state.error);

export const useRestaurantProfileHasLoaded = () =>
  useRestaurantProfileStore((state) => state.hasLoadedProfile);

// Combined selector for restaurant status
export const useRestaurantStatus = () =>
  useRestaurantProfileStore((state) => ({
    isOpen: state.restaurantProfile?.isOpen || false,
    verificationStatus:
      state.restaurantProfile?.verificationStatus || 'PENDING',
    isLoading: state.isLoading,
    isUpdating: state.isUpdating,
  }));

// Restaurant info selector
export const useRestaurantInfo = () =>
  useRestaurantProfileStore((state) => ({
    profile: state.restaurantProfile,
    isLoading: state.isLoading,
    error: state.error,
    hasLoaded: state.hasLoadedProfile,
  }));
