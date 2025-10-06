// useLocation.ts
import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import LocationService from './LocationService';
import { useLocationStore } from './store';
import { PermissionStatus } from './types';

interface UseLocationOptions {
  autoRequest?: boolean; // Only get cached location on mount
  requestOnMount?: boolean; // Actually request permission on mount (use sparingly)
}

export const useLocation = (options: UseLocationOptions = {}) => {
  const { autoRequest = true, requestOnMount = false } = options;

  // Use store for persistence
  const {
    location: storedLocation,
    isLoading: storeLoading,
    error: storeError,
    hasPermission: storePermission,
    setLocation,
    setLoading,
    setError,
    setPermission,
    clearError,
  } = useLocationStore();

  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>(
    PermissionStatus.NOT_REQUESTED,
  );

  // Initialize on mount
  useEffect(() => {
    const initialize = async () => {
      try {
        // Check permission status
        const status = await LocationService.getPermissionStatus();
        setPermissionStatus(status);
        setPermission(status === PermissionStatus.GRANTED);

        if (autoRequest) {
          // Try to get cached location first (no permission needed)
          const cachedLocation = LocationService.getCachedLocation();
          if (cachedLocation) {
            setLocation(cachedLocation);
            return;
          }

          // If we have permission, get current location
          if (status === PermissionStatus.GRANTED) {
            await getCurrentLocation();
          } else if (!storedLocation) {
            // No permission and no cached location - use fallback
            const fallback = await LocationService.getCurrentLocation();
            if (fallback.location) {
              setLocation(fallback.location);
            }
          }
        }

        // Only auto-request permission if explicitly enabled (not recommended for UX)
        if (requestOnMount && status === PermissionStatus.NOT_REQUESTED) {
          await requestPermissionWithLocation();
        }
      } catch (error) {
        // Use fallback location on initialization error
        const fallback = await LocationService.getCurrentLocation();
        if (fallback.location) {
          setLocation(fallback.location);
        }
      }
    };

    initialize();
  }, [autoRequest, requestOnMount]);

  const getCurrentLocation = useCallback(
    async (forceRefresh = false): Promise<boolean> => {
      setLoading(true);
      clearError();

      try {
        const result = await LocationService.getCurrentLocation(forceRefresh);

        if (result.location) {
          setLocation(result.location);
        }

        if (result.error) {
          setError(result.error);
        }

        return result.success;
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : 'Failed to get location';
        setError(errorMsg);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [setLocation, setLoading, setError, clearError],
  );

  const requestPermissionOnly = useCallback(async (): Promise<boolean> => {
    try {
      const result = await LocationService.requestPermission();
      setPermissionStatus(result.status);
      setPermission(result.granted);

      return result.granted;
    } catch (error) {
      console.error('Error requesting permission:', error);
      return false;
    }
  }, [setPermission]);

  const requestPermissionWithLocation =
    useCallback(async (): Promise<boolean> => {
      setLoading(true);
      clearError();

      try {
        const permResult = await LocationService.requestPermission();
        setPermissionStatus(permResult.status);
        setPermission(permResult.granted);

        if (permResult.granted) {
          const locationResult = await LocationService.getCurrentLocation(true);
          if (locationResult.location) {
            setLocation(locationResult.location);
          }
          if (locationResult.error) {
            setError(locationResult.error);
          }
          return locationResult.success;
        } else {
          // Permission denied - use fallback
          const fallback = await LocationService.getCurrentLocation();
          if (fallback.location) {
            setLocation(fallback.location);
          }
          setError('Location permission denied');
          return false;
        }
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : 'Failed to get location';
        setError(errorMsg);
        return false;
      } finally {
        setLoading(false);
      }
    }, [setLocation, setLoading, setError, setPermission, clearError]);

  const showLocationPermissionDialog = useCallback(
    (onEnable: () => void, onCancel?: () => void) => {
      Alert.alert(
        'Enable Location Services',
        'To show nearby restaurants and provide accurate delivery estimates, please allow location access.',
        [
          {
            text: 'Not Now',
            style: 'cancel',
            onPress: onCancel,
          },
          {
            text: 'Enable Location',
            onPress: onEnable,
          },
        ],
      );
    },
    [],
  );

  const refreshLocation = useCallback(() => {
    return getCurrentLocation(true);
  }, [getCurrentLocation]);

  const clearCache = useCallback(() => {
    LocationService.clearCache();
  }, []);

  const getCoordinates = useCallback(() => {
    if (storedLocation) {
      return {
        latitude: storedLocation.latitude,
        longitude: storedLocation.longitude,
      };
    }
    return LocationService.getDefaultCoordinates();
  }, [storedLocation]);

  return {
    // State
    location: storedLocation,
    isLoading: storeLoading,
    error: storeError,
    hasPermission: storePermission,
    permissionStatus,

    // Computed
    isUsingFallback: storedLocation?.isFallback ?? false,
    hasValidLocation: storedLocation !== null,
    coordinates: getCoordinates(),

    // Actions
    getCurrentLocation,
    requestPermissionOnly,
    requestPermissionWithLocation,
    refreshLocation,
    clearCache,

    // Helpers
    showLocationPermissionDialog,
    getCoordinates,
  };
};
