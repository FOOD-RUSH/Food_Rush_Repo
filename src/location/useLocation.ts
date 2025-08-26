import { useCallback, useEffect, useRef } from 'react';
import { Alert, Linking } from 'react-native';
import { useLocationStore } from './store';
import { LocationOptions, PermissionStatus } from './types';
import LocationService from './LocationService';

interface UseLocationOptions extends LocationOptions {
  autoInit?: boolean;
  showPermissionAlert?: boolean;
  showServicesAlert?: boolean;
}

/**
 * Simple location hook with automatic store integration
 * 
 * Features:
 * - Automatic initialization on mount
 * - Permission handling with user-friendly alerts
 * - Store integration
 * - Fallback to Yaoundé when needed
 * - Clean, simple API
 */
export const useLocation = (options: UseLocationOptions = {}) => {
  const {
    autoInit = true,
    showPermissionAlert = true,
    showServicesAlert = true,
    fallbackToYaounde = true,
    enableHighAccuracy = true,
    timeout = 15000,
  } = options;

  // Store state and actions
  const {
    location,
    isLoading,
    error,
    hasPermission,
    permissionRequested,
    servicesEnabled,
    setLocation,
    setLoading,
    setError,
    setPermission,
    setPermissionRequested,
    setServicesEnabled,
    setFallbackLocation,
    clearError,
  } = useLocationStore();

  // Prevent concurrent requests
  const isRequestingRef = useRef(false);

  /**
   * Check location services status
   */
  const checkServices = useCallback(async () => {
    try {
      const enabled = await LocationService.areLocationServicesEnabled();
      setServicesEnabled(enabled);
      
      if (!enabled && showServicesAlert) {
        Alert.alert(
          'Location Services Disabled',
          'Please enable location services in your device settings for a better experience.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Open Settings',
              onPress: () => Linking.openSettings(),
            },
          ]
        );
      }
      
      return enabled;
    } catch (error) {
      console.warn('useLocation: Error checking services:', error);
      setServicesEnabled(false);
      return false;
    }
  }, [setServicesEnabled, showServicesAlert]);

  /**
   * Check permission status
   */
  const checkPermission = useCallback(async () => {
    try {
      const status = await LocationService.getPermissionStatus();
      const granted = status === PermissionStatus.GRANTED;
      setPermission(granted);
      return granted;
    } catch (error) {
      console.warn('useLocation: Error checking permission:', error);
      setPermission(false);
      return false;
    }
  }, [setPermission]);

  /**
   * Request location permission
   */
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (isRequestingRef.current) return false;

    try {
      isRequestingRef.current = true;
      setPermissionRequested(true);
      clearError();

      const granted = await LocationService.requestPermission();
      setPermission(granted);

      if (!granted && showPermissionAlert) {
        Alert.alert(
          'Location Permission Denied',
          'Location access was denied. We\'ll use Yaoundé as your default location. You can enable location access later in settings.',
          [
            { text: 'OK', style: 'default' },
            {
              text: 'Open Settings',
              onPress: () => Linking.openSettings(),
            },
          ]
        );
      }

      return granted;
    } catch (error) {
      console.warn('useLocation: Error requesting permission:', error);
      setError(error instanceof Error ? error.message : 'Permission request failed');
      return false;
    } finally {
      isRequestingRef.current = false;
    }
  }, [
    setPermissionRequested,
    setPermission,
    setError,
    clearError,
    showPermissionAlert,
  ]);

  /**
   * Get current location
   */
  const getCurrentLocation = useCallback(async (forceRefresh = false): Promise<boolean> => {
    if (isRequestingRef.current) return false;

    try {
      isRequestingRef.current = true;
      setLoading(true);
      clearError();

      // Clear cache if force refresh
      if (forceRefresh) {
        LocationService.clearCache();
      }

      const result = await LocationService.getCurrentLocation({
        enableHighAccuracy,
        timeout,
        fallbackToYaounde,
      });

      if (result.location) {
        setLocation(result.location);
      }

      if (result.error && !result.location) {
        setError(result.error);
      }

      return result.success;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get location';
      console.warn('useLocation: Error getting location:', errorMessage);
      setError(errorMessage);
      
      // Set fallback location on error
      if (fallbackToYaounde) {
        setFallbackLocation();
      }
      
      return false;
    } finally {
      setLoading(false);
      isRequestingRef.current = false;
    }
  }, [
    setLoading,
    setLocation,
    setError,
    setFallbackLocation,
    clearError,
    enableHighAccuracy,
    timeout,
    fallbackToYaounde,
  ]);

  /**
   * Initialize location on mount
   */
  const initializeLocation = useCallback(async () => {
    if (!autoInit || isRequestingRef.current) return;

    try {
      // Check services and permission
      const [servicesOk, hasPermissionNow] = await Promise.all([
        checkServices(),
        checkPermission(),
      ]);

      if (!servicesOk) {
        // Services disabled, use fallback
        if (fallbackToYaounde) {
          setFallbackLocation();
        }
        return;
      }

      if (hasPermissionNow) {
        // Permission granted, get location
        await getCurrentLocation();
      } else if (!permissionRequested) {
        // Permission not requested yet, try to request it
        const granted = await requestPermission();
        if (granted) {
          await getCurrentLocation();
        } else if (fallbackToYaounde) {
          setFallbackLocation();
        }
      } else if (fallbackToYaounde) {
        // Permission was denied previously, use fallback
        setFallbackLocation();
      }
    } catch (error) {
      console.warn('useLocation: Error initializing location:', error);
      if (fallbackToYaounde) {
        setFallbackLocation();
      }
    }
  }, [
    autoInit,
    permissionRequested,
    fallbackToYaounde,
    checkServices,
    checkPermission,
    getCurrentLocation,
    requestPermission,
    setFallbackLocation,
  ]);

  // Initialize on mount
  useEffect(() => {
    initializeLocation();
  }, [initializeLocation]);

  /**
   * Refresh location (clears cache and gets fresh location)
   */
  const refreshLocation = useCallback(async (): Promise<boolean> => {
    return getCurrentLocation(true);
  }, [getCurrentLocation]);

  // Computed values
  const hasValidLocation = location !== null;
  const isUsingFallback = location?.isFallback ?? false;
  const canRequestLocation = servicesEnabled && !hasPermission && !isLoading;

  return {
    // State
    location,
    isLoading,
    error,
    hasPermission,
    permissionRequested,
    servicesEnabled,
    hasValidLocation,
    isUsingFallback,
    canRequestLocation,

    // Actions
    getCurrentLocation,
    refreshLocation,
    requestPermission,
    checkServices,
    checkPermission,
    clearError,
    
    // Helpers
    setFallbackLocation,
  };
};
