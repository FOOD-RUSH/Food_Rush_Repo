// src/location/store.ts - Simple Zustand store
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Address, LocationState, ManualAddressInput } from './types';
import LocationService from './LocationService';

const initialState: LocationState = {
  currentLocation: null,
  savedAddresses: [],
  isLoading: false,
  hasPermission: false,
  permissionStatus: 'undetermined',
  lastError: null,
  isUsingFallback: false,
};

interface LocationActions {
  // Core actions
  setCurrentLocation: (location: Address | null) => void;
  setLoading: (loading: boolean) => void;
  setPermission: (granted: boolean, status: string) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setUsingFallback: (isFallback: boolean) => void;

  // Address management
  addSavedAddress: (address: Address) => void;
  deleteSavedAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;

  // Utility
  createAddress: (street: string, coordinates: any, landmark?: string, isGPSLocation?: boolean, label?: string) => Address;
  createFallbackAddress: () => Address;

  // Reset
  reset: () => void;
}

export const useLocationStore = create<LocationState & LocationActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setCurrentLocation: (location) => set({ currentLocation: location }),
      setLoading: (loading) => set({ isLoading: loading }),
      setPermission: (granted, status) => set({
        hasPermission: granted,
        permissionStatus: status as 'undetermined' | 'granted' | 'denied'
      }),
      setError: (error) => set({ lastError: error }),
      clearError: () => set({ lastError: null }),
      setUsingFallback: (isFallback) => set({ isUsingFallback: isFallback }),

      addSavedAddress: (address) => {
        const state = get();
        const existingIndex = state.savedAddresses.findIndex(addr => addr.id === address.id);

        if (existingIndex >= 0) {
          const updatedAddresses = [...state.savedAddresses];
          updatedAddresses[existingIndex] = address;
          set({ savedAddresses: updatedAddresses });
        } else {
          set({ savedAddresses: [address, ...state.savedAddresses].slice(0, 5) });
        }
      },

      deleteSavedAddress: (id) => {
        const state = get();
        const updatedAddresses = state.savedAddresses.filter(addr => addr.id !== id);
        set({ savedAddresses: updatedAddresses });

        if (state.currentLocation?.id === id) {
          set({ currentLocation: null });
        }
      },

      setDefaultAddress: (id) => {
        const state = get();
        const updatedAddresses = state.savedAddresses.map(addr => ({
          ...addr,
          isDefault: addr.id === id,
        }));
        set({ savedAddresses: updatedAddresses });

        const defaultAddr = updatedAddresses.find(addr => addr.isDefault);
        if (defaultAddr) {
          set({ currentLocation: defaultAddr });
        }
      },

      createAddress: (street, coordinates, landmark, isGPSLocation = false, label) => {
        const now = new Date().toISOString();
        const fullAddress = landmark ? `${street}, ${landmark}, Yaoundé` : `${street}, Yaoundé`;

        return {
          id: `addr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          street,
          landmark,
          fullAddress,
          coordinates,
          isDefault: false,
          isGPSLocation,
          isFallback: false,
          createdAt: now,
        };
      },

      createFallbackAddress: () => {
        const fallbackCoords = LocationService.getDefaultLocation();
        const now = new Date().toISOString();

        return {
          id: 'fallback-yaounde',
          street: 'Centre-ville',
          fullAddress: 'Centre-ville, Yaoundé',
          coordinates: fallbackCoords,
          isDefault: false,
          isGPSLocation: false,
          isFallback: true,
          createdAt: now,
        };
      },

      reset: () => set(initialState),
    }),
    {
      name: 'food-rush-location',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        currentLocation: state.currentLocation,
        savedAddresses: state.savedAddresses,
        hasPermission: state.hasPermission,
        permissionStatus: state.permissionStatus,
      }),
    }
  )
);

// Simple selectors
export const useCurrentLocation = () => useLocationStore((state) => state.currentLocation);
export const useLocationLoading = () => useLocationStore((state) => state.isLoading);
export const useLocationError = () => useLocationStore((state) => state.lastError);
export const useLocationPermission = () => useLocationStore((state) => ({
  hasPermission: state.hasPermission,
  status: state.permissionStatus
}));
export const useIsUsingFallback = () => useLocationStore((state) => state.isUsingFallback);

export const useLocationActions = () => useLocationStore((state) => ({
  setCurrentLocation: state.setCurrentLocation,
  addSavedAddress: state.addSavedAddress,
  deleteSavedAddress: state.deleteSavedAddress,
  setDefaultAddress: state.setDefaultAddress,
  createAddress: state.createAddress,
  createFallbackAddress: state.createFallbackAddress,
  setLoading: state.setLoading,
  setPermission: state.setPermission,
  setError: state.setError,
  clearError: state.clearError,
  setUsingFallback: state.setUsingFallback,
  reset: state.reset,
}));
