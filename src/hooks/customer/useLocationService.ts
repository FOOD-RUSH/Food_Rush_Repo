import { useLocationData, useDefaultAddress } from '@/src/location';
import { YAOUNDE_CENTER } from '@/src/location/constants';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

const DEFAULT_COORDINATES = YAOUNDE_CENTER;

/**
 * Hook for location-dependent queries
 * Provides coordinates with proper caching integration
 * Enhanced with better location tracking and debugging
 */
export const useLocationForQueries = () => {
  const location = useLocationData();
  const defaultAddress = useDefaultAddress();
  const queryClient = useQueryClient();
  const previousCoordinatesRef = useRef<{ lat: number; lng: number } | null>(
    null,
  );

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
  const isUsingFallback = !hasRealLocation && !hasAddressLocation;

  const locationSource = location
    ? location.isFallback
      ? 'fallback'
      : 'gps'
    : defaultAddress
      ? 'saved_address'
      : 'default';

  // Track coordinate changes and invalidate queries when location changes
  useEffect(() => {
    const currentCoords = {
      lat: coordinates.latitude,
      lng: coordinates.longitude,
    };
    const previousCoords = previousCoordinatesRef.current;

    // Check if coordinates have actually changed (threshold of ~100m)
    if (
      previousCoords &&
      (Math.abs(currentCoords.lat - previousCoords.lat) > 0.001 ||
        Math.abs(currentCoords.lng - previousCoords.lng) > 0.001)
    ) {

      // Invalidate all location-dependent queries
      queryClient.invalidateQueries({ queryKey: ['browse-restaurants'] });
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
      queryClient.invalidateQueries({ queryKey: ['menu'] });
      queryClient.invalidateQueries({ queryKey: ['restaurant-details'] });
    }

    previousCoordinatesRef.current = currentCoords;
  }, [
    coordinates.latitude,
    coordinates.longitude,
    locationSource,
    queryClient,
  ]);

  // Enhanced logging for debugging

  return {
    nearLat: coordinates.latitude,
    nearLng: coordinates.longitude,
    hasLocation: hasRealLocation,
    hasAddressLocation,
    isUsingFallback,
    locationSource,
    locationQueryKey: ['location', coordinates.latitude, coordinates.longitude],
    // Additional helper methods
    getLocationInfo: () => ({
      coordinates,
      source: locationSource,
      isReal: hasRealLocation,
      address:
        location?.formattedAddress ||
        defaultAddress?.address ||
        'Yaoundé, Cameroun',
    }),
  };
};

// Helper function to calculate distance between two coordinates (currently unused but kept for future use)
// function calculateDistance(
//   coord1: { lat: number; lng: number },
//   coord2: { lat: number; lng: number },
// ): number {
//   const R = 6371; // Earth's radius in kilometers
//   const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
//   const dLng = ((coord2.lng - coord1.lng) * Math.PI) / 180;
//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos((coord1.lat * Math.PI) / 180) *
//       Math.cos((coord2.lat * Math.PI) / 180) *
//       Math.sin(dLng / 2) *
//       Math.sin(dLng / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c; // Distance in kilometers
// }

/**
 * Hook to get current location status and actions
 * Useful for UI components that need to show location status
 */
export const useLocationStatus = () => {
  const {
    nearLat,
    nearLng,
    hasLocation,
    hasAddressLocation,
    isUsingFallback,
    locationSource,
    getLocationInfo,
  } = useLocationForQueries();

  const locationInfo = getLocationInfo();

  return {
    coordinates: { lat: nearLat, lng: nearLng },
    hasRealLocation: hasLocation,
    hasAddressLocation,
    isUsingFallback,
    locationSource,
    locationText: locationInfo.address,
    statusText: getLocationStatusText(locationSource, hasLocation),
    statusColor: getLocationStatusColor(locationSource, hasLocation),
  };
};

// Helper functions for location status
function getLocationStatusText(source: string, hasReal: boolean): string {
  switch (source) {
    case 'gps':
      return 'Using current location';
    case 'fallback':
      return 'Using approximate location';
    case 'saved_address':
      return 'Using saved address';
    case 'default':
      return 'Using default location';
    default:
      return 'Location unknown';
  }
}

function getLocationStatusColor(source: string, hasReal: boolean): string {
  switch (source) {
    case 'gps':
      return '#4CAF50'; // Green
    case 'fallback':
      return '#FF9800'; // Orange
    case 'saved_address':
      return '#2196F3'; // Blue
    case 'default':
      return '#9E9E9E'; // Gray
    default:
      return '#9E9E9E';
  }
}
