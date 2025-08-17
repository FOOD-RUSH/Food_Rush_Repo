import { useEffect, useState } from 'react';
import { geolocationService } from '@/src/services/customer/geolocation.service';
import { useGeolocationStore } from '@/src/stores/customerStores/geolocationStore';
import { LocationResult, ReverseGeocodeResult } from '@/src/services/customer/geolocation.service';

export const useGeolocation = () => {
  // Store hooks
  const currentLocation = useGeolocationStore((state) => state.currentLocation);
  const locationPermission = useGeolocationStore((state) => state.locationPermission);
  const reverseGeocodeResult = useGeolocationStore((state) => state.reverseGeocodeResult);
  const isLocationLoading = useGeolocationStore((state) => state.isLocationLoading);
  const locationError = useGeolocationStore((state) => state.locationError);
  const isWatching = useGeolocationStore((state) => state.isWatching);
  
  const requestPermission = useGeolocationStore((state) => state.requestPermission);
  const getCurrentLocation = useGeolocationStore((state) => state.getCurrentLocation);
  const startWatching = useGeolocationStore((state) => state.startWatching);
  const stopWatching = useGeolocationStore((state) => state.stopWatching);
  const reverseGeocodeCurrentLocation = useGeolocationStore((state) => state.reverseGeocodeCurrentLocation);
  const reverseGeocode = useGeolocationStore((state) => state.reverseGeocode);
  const setLocation = useGeolocationStore((state) => state.setLocation);
  const clearError = useGeolocationStore((state) => state.clearError);

  return {
    // State
    currentLocation,
    locationPermission,
    reverseGeocodeResult,
    isLocationLoading,
    locationError,
    isWatching,
    
    // Actions
    requestPermission,
    getCurrentLocation,
    startWatching,
    stopWatching,
    reverseGeocodeCurrentLocation,
    reverseGeocode,
    setLocation,
    clearError,
  };
};

// Hook for getting current location with automatic permission request
export const useCurrentLocation = () => {
  const [location, setLocation] = useState<LocationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const getLocation = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Request permission first
      const permission = await geolocationService.requestLocationPermission();
      
      if (permission.status === 'granted') {
        const loc = await geolocationService.getCurrentLocation();
        setLocation(loc);
      } else {
        throw new Error('Location permission denied');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to get location');
    } finally {
      setLoading(false);
    }
  };
  
  return {
    location,
    loading,
    error,
    getLocation,
  };
};

// Hook for reverse geocoding
export const useReverseGeocode = () => {
  const [address, setAddress] = useState<ReverseGeocodeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const reverseGeocode = async (latitude: number, longitude: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await geolocationService.reverseGeocode(latitude, longitude);
      setAddress(result);
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to reverse geocode');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    address,
    loading,
    error,
    reverseGeocode,
  };
};