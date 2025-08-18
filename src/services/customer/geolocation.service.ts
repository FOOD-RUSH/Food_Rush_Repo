import * as Location from 'expo-location';
import { Platform } from 'react-native';
import { Location as LocationType } from '@/src/types';

export interface LocationPermissionResult {
  status: 'granted' | 'denied' | 'undetermined';
  canAcquireLocation: boolean;
}

export interface LocationResult {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: number;
}

export interface ReverseGeocodeResult {
  address: string;
  city?: string;
  region?: string;
  country?: string;
  postalCode?: string;
}

export const geolocationService = {
  // Request location permissions
  requestLocationPermission: async (): Promise<LocationPermissionResult> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      return {
        status,
        canAcquireLocation: status === 'granted',
      };
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return {
        status: 'denied',
        canAcquireLocation: false,
      };
    }
  },

  // Get current location
  getCurrentLocation: async (): Promise<LocationResult> => {
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      
      if (permission.status !== 'granted') {
        throw new Error('Location permission not granted');
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Platform.OS === 'android' 
          ? Location.Accuracy.High 
          : Location.Accuracy.BestForNavigation,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy ?? undefined,
        timestamp: location.timestamp,
      };
    } catch (error) {
      console.error('Error getting current location:', error);
      throw error;
    }
  },

  // Watch position updates
  watchPosition: (
    callback: (location: LocationResult) => void,
    options?: Location.LocationOptions
  ): Promise<Location.LocationSubscription | null> => {
    try {
      const subscription = Location.watchPositionAsync(
        options || {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (location: Location.LocationObject) => {
          callback({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy ?? undefined,
            timestamp: location.timestamp,
          });
        }
      );

      return subscription;
    } catch (error) {
      console.error('Error watching position:', error);
      return Promise.resolve(null);
    }
  },

  // Reverse geocode (coordinates to address)
  reverseGeocode: async (latitude: number, longitude: number): Promise<ReverseGeocodeResult> => {
    try {
      const locations = await Location.reverseGeocodeAsync({ latitude, longitude });
      
      if (locations.length > 0) {
        const location = locations[0];
        return {
          address: `${location.street || ''} ${location.city || ''}`.trim(),
          city: location.city ?? undefined,
          region: location.region ?? undefined,
          country: location.country ?? undefined,
          postalCode: location.postalCode ?? undefined,
        };
      } else {
        return {
          address: '',
        };
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      throw error;
    }
  },

  // Geocode (address to coordinates)
  geocode: async (address: string): Promise<LocationType> => {
    try {
      const locations = await Location.geocodeAsync(address);
      
      if (locations.length > 0) {
        return {
          latitude: locations[0].latitude,
          longitude: locations[0].longitude,
          address,
        };
      } else {
        throw new Error('No location found for the provided address');
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
      throw error;
    }
  },

  // Calculate distance between two points (in kilometers)
  calculateDistance: (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
  },

  // Get location with timeout
  getLocationWithTimeout: async (timeoutMs: number = 10000): Promise<LocationResult> => {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Location request timed out'));
      }, timeoutMs);

      geolocationService.getCurrentLocation()
        .then((location) => {
          clearTimeout(timeout);
          resolve(location);
        })
        .catch((error) => {
          clearTimeout(timeout);
          reject(error);
        });
    });
  },
};