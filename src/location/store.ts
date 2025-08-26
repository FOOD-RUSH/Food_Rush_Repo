import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Location, LocationState } from './types';
import LocationService from './LocationService';

interface LocationActions {
  // Core actions
  setLocation: (location: Location) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setPermission: (hasPermission: boolean) => void;
  setPermissionRequested: (requested: boolean) => void;
  setServicesEnabled: (enabled: boolean) => void;
  
  // Computed actions
  setFallbackLocation: () => void;
  clearError: () => void;
  reset: () => void;
}

export interface LocationStore extends LocationState, LocationActions {}

const initialState: LocationState = {
  location: null,
  isLoading: false,
  error: null,
  hasPermission: false,
  permissionRequested: false,
  servicesEnabled: true,
};

export const useLocationStore = create<LocationStore>()(
  persist(
    (set, get) => ({
      // Initial state
      ...initialState,

      // Actions
      setLocation: (location) => {
        set({
          location,
          error: null, // Clear error when location is set
          isLoading: false,
        });
      },

      setLoading: (isLoading) => {
        set({ isLoading });
      },

      setError: (error) => {
        set({
          error,
          isLoading: false,
        });
      },

      setPermission: (hasPermission) => {
        set({ hasPermission });
      },

      setPermissionRequested: (permissionRequested) => {
        set({ permissionRequested });
      },

      setServicesEnabled: (servicesEnabled) => {
        set({ servicesEnabled });
      },

      setFallbackLocation: () => {
        const fallbackLocation = LocationService.getFallbackLocation();
        set({
          location: fallbackLocation,
          error: null,
          isLoading: false,
        });
      },

      clearError: () => {
        set({ error: null });
      },

      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'location-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist these values
      partialize: (state) => ({
        location: state.location,
        hasPermission: state.hasPermission,
        permissionRequested: state.permissionRequested,
      }),
    }
  )
);

// Selectors for common state combinations
export const useLocationData = () => useLocationStore((state) => state.location);
export const useLocationLoading = () => useLocationStore((state) => state.isLoading);
export const useLocationError = () => useLocationStore((state) => state.error);
export const useLocationPermission = () => useLocationStore((state) => state.hasPermission);
