import { useLocationData, useDefaultAddress } from '@/src/location';
import { YAOUNDE_CENTER } from '@/src/location/constants';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

const DEFAULT_COORDINATES = YAOUNDE_CENTER;

/**
 * Hook for location-dependent queries
 * Provides coordinates with proper caching integration
 * Now uses the new location store system with saved address fallback
 */
export const useLocationForQueries = () => {
  const location = useLocationData();
  const defaultAddress = useDefaultAddress();
  const queryClient = useQueryClient();
  const previousCoordinatesRef = useRef<{ lat: number; lng: number } | null>(null);

  // Priority order: current location -> default saved address -> Yaoundé center
  const coordinates = location
    ? {
        latitude: location.latitude,
        longitude: location.longitude,
      }
    : defaultAddress
    ? {
        latitude: defaultAddress.latitude,
        longitude: defaultAddress.longitude,
      }
    : DEFAULT_COORDINATES;

  const hasRealLocation = !!location && !location.isFallback;
  const hasAddressLocation = !!defaultAddress;
  
  const locationSource = location ? 'gps' : defaultAddress ? 'saved_address' : 'default';
  
  // Track coordinate changes and invalidate queries when location changes
  useEffect(() => {
    const currentCoords = { lat: coordinates.latitude, lng: coordinates.longitude };
    const previousCoords = previousCoordinatesRef.current;
    
    // Check if coordinates have actually changed
    if (previousCoords && 
        (Math.abs(currentCoords.lat - previousCoords.lat) > 0.001 || 
         Math.abs(currentCoords.lng - previousCoords.lng) > 0.001)) {
      
      console.log('🔄 Location changed, invalidating queries:', {
        from: previousCoords,
        to: currentCoords,
        source: locationSource
      });
      
      // Invalidate all location-dependent queries
      queryClient.invalidateQueries({ queryKey: ['nearby-restaurants'] });
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
      queryClient.invalidateQueries({ queryKey: ['menu'] });
      queryClient.invalidateQueries({ queryKey: ['restaurant-details'] });
    }
    
    previousCoordinatesRef.current = currentCoords;
  }, [coordinates.latitude, coordinates.longitude, locationSource, queryClient]);
  
  console.log('📍 Location for Queries:', {
    coordinates,
    locationSource,
    hasRealLocation,
    hasAddressLocation,
    location,
    defaultAddress
  });

  return {
    nearLat: coordinates.latitude,
    nearLng: coordinates.longitude,
    hasLocation: hasRealLocation,
    hasAddressLocation,
    locationSource,
    locationQueryKey: ['location', coordinates.latitude, coordinates.longitude],
  };
};
