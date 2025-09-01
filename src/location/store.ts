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
  
  // Batched update for performance
  setBatch: (updates: Partial<LocationState>) => void;
  
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
    (set) => ({
      // Initial state
      ...initialState,

      // Batched update for performance optimization
      setBatch: (updates) => {
        set((state) => ({
          ...state,
          ...updates,
        }));
      },

      // Individual actions (use setBatch when possible)
      setLocation: (location) => {
        set((state) => ({
          ...state,
          location,
          error: null,
          isLoading: false,
        }));
      },

      setLoading: (isLoading) => {
        set((state) => ({ ...state, isLoading }));
      },

      setError: (error) => {
        set((state) => ({
          ...state,
          error,
          isLoading: false,
        }));
      },

      setPermission: (hasPermission) => {
        set((state) => ({ ...state, hasPermission }));
      },

      setPermissionRequested: (permissionRequested) => {
        set((state) => ({ ...state, permissionRequested }));
      },

      setServicesEnabled: (servicesEnabled) => {
        set((state) => ({ ...state, servicesEnabled }));
      },

      setFallbackLocation: () => {
        const fallbackLocation = LocationService.getFallbackLocation();
        set((state) => ({
          ...state,
          location: fallbackLocation,
          error: null,
          isLoading: false,
        }));
      },

      clearError: () => {
        set((state) => ({ ...state, error: null }));
      },

      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'location-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist essential values
      partialize: (state) => ({
        location: state.location,
        hasPermission: state.hasPermission,
        permissionRequested: state.permissionRequested,
      }),
      // Optimize storage writes
      skipHydration: false,
    }
  )
);

// Optimized selectors to prevent unnecessary re-renders
export const useLocationData = () => useLocationStore((state) => state.location);
export const useLocationLoading = () => useLocationStore((state) => state.isLoading);
export const useLocationError = () => useLocationStore((state) => state.error);
export const useLocationPermission = () => useLocationStore((state) => state.hasPermission);

// Combined selectors for better performance
export const useLocationStatus = () => useLocationStore((state) => ({
  location: state.location,
  isLoading: state.isLoading,
  error: state.error,
  hasPermission: state.hasPermission,
}));

export const useLocationInfo = () => useLocationStore((state) => ({
  location: state.location,
  hasPermission: state.hasPermission,
  servicesEnabled: state.servicesEnabled,
}));
