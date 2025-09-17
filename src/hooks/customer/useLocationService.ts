import { useLocationData } from '@/src/location';
import { YAOUNDE_CENTER } from '@/src/location/constants';

const DEFAULT_COORDINATES = YAOUNDE_CENTER;

/**
 * Hook for location-dependent queries
 * Provides coordinates with proper caching integration
 * Now uses the new location store system
 */
export const useLocationForQueries = () => {
  const location = useLocationData();
  
  // Use current location if available, otherwise fallback to default
  const coordinates = location ? {
    latitude: location.latitude,
    longitude: location.longitude,
  } : DEFAULT_COORDINATES;

  return {
    nearLat: coordinates.latitude,
    nearLng: coordinates.longitude,
    hasLocation: !!location && !location.isFallback,
    locationQueryKey: ['location', coordinates.latitude, coordinates.longitude],
  };
};
