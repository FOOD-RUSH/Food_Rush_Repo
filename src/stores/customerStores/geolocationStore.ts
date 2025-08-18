import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { geolocationService, LocationResult, ReverseGeocodeResult } from '@/src/services/customer/geolocation.service';

interface GeolocationState {
  currentLocation: LocationResult | null;
  locationPermission: 'granted' | 'denied' | 'undetermined';
  reverseGeocodeResult: ReverseGeocodeResult | null;
  isLocationLoading: boolean;
  locationError: string | null;
  isWatching: boolean;
}

interface GeolocationActions {
  // Request location permission
  requestPermission: () => Promise<void>;
  
  // Get current location
  getCurrentLocation: () => Promise<void>;
  
  // Start watching location
  startWatching: () => Promise<void>;
  
  // Stop watching location
  stopWatching: () => void;
  
  // Reverse geocode current location
  reverseGeocodeCurrentLocation: () => Promise<void>;
  
  // Reverse geocode specific coordinates
  reverseGeocode: (latitude: number, longitude: number) => Promise<void>;
  
  // Set location manually
  setLocation: (location: LocationResult) => void;
  
  // Clear error
  clearError: () => void;
  
  // Reset store
  reset: () => void;
}

const initialState: GeolocationState = {
  currentLocation: null,
  locationPermission: 'undetermined',
  reverseGeocodeResult: null,
  isLocationLoading: false,
  locationError: null,
  isWatching: false,
};

export const useGeolocationStore = create<GeolocationState & GeolocationActions>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        requestPermission: async () => {
          try {
            set({ isLocationLoading: true, locationError: null });
            const permissionResult = await geolocationService.requestLocationPermission();
            
            set({ 
              locationPermission: permissionResult.status,
              isLocationLoading: false 
            });
          } catch (error: any) {
            set({ 
              locationError: error.message || 'Failed to request location permission',
              isLocationLoading: false 
            });
          }
        },
        
        getCurrentLocation: async () => {
          try {
            set({ isLocationLoading: true, locationError: null });
            const location = await geolocationService.getCurrentLocation();
            
            set({ 
              currentLocation: location,
              isLocationLoading: false 
            });
          } catch (error: any) {
            set({ 
              locationError: error.message || 'Failed to get current location',
              isLocationLoading: false 
            });
          }
        },
        
        startWatching: async () => {
          try {
            set({ isLocationLoading: true, locationError: null });
            
            // Check permission first
            const permission = get().locationPermission;
            if (permission !== 'granted') {
              await get().requestPermission();
            }
            
            if (get().locationPermission === 'granted') {
              set({ isWatching: true, isLocationLoading: false });
            } else {
              set({ 
                locationError: 'Location permission not granted',
                isLocationLoading: false 
              });
            }
          } catch (error: any) {
            set({ 
              locationError: error.message || 'Failed to start location watching',
              isLocationLoading: false 
            });
          }
        },
        
        stopWatching: () => {
          set({ isWatching: false });
        },
        
        reverseGeocodeCurrentLocation: async () => {
          try {
            const location = get().currentLocation;
            if (!location) {
              set({ locationError: 'No current location available' });
              return;
            }
            
            set({ isLocationLoading: true, locationError: null });
            const result = await geolocationService.reverseGeocode(
              location.latitude, 
              location.longitude
            );
            
            set({ 
              reverseGeocodeResult: result,
              isLocationLoading: false 
            });
          } catch (error: any) {
            set({ 
              locationError: error.message || 'Failed to reverse geocode location',
              isLocationLoading: false 
            });
          }
        },
        
        reverseGeocode: async (latitude: number, longitude: number) => {
          try {
            set({ isLocationLoading: true, locationError: null });
            const result = await geolocationService.reverseGeocode(latitude, longitude);
            
            set({ 
              reverseGeocodeResult: result,
              isLocationLoading: false 
            });
          } catch (error: any) {
            set({ 
              locationError: error.message || 'Failed to reverse geocode location',
              isLocationLoading: false 
            });
          }
        },
        
        setLocation: (location) => {
          set({ currentLocation: location });
        },
        
        clearError: () => {
          set({ locationError: null });
        },
        
        reset: () => {
          set(initialState);
        },
      }),
      {
        name: 'geolocation-storage',
        storage: createJSONStorage(() => AsyncStorage),
        partialize: (state) => ({
          currentLocation: state.currentLocation,
          locationPermission: state.locationPermission,
        }),
        version: 1,
      }
    ),
    { name: 'GeolocationStore' }
  )
);

// Selector hooks for better performance
export const useCurrentLocation = () => useGeolocationStore((state) => state.currentLocation);
export const useLocationPermission = () => useGeolocationStore((state) => state.locationPermission);
export const useReverseGeocodeResult = () => useGeolocationStore((state) => state.reverseGeocodeResult);
export const useLocationLoading = () => useGeolocationStore((state) => state.isLocationLoading);
export const useLocationError = () => useGeolocationStore((state) => state.locationError);
export const useIsWatching = () => useGeolocationStore((state) => state.isWatching);