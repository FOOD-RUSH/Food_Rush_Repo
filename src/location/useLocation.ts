import { useCallback, useEffect, useRef, useMemo } from 'react';
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
 * Fixed location hook with stable dependencies and batched updates
 * Optimized for Cameroon network conditions
 */
export const useLocation = (options: UseLocationOptions = {}) => {
  const {
    autoInit = true,
    showPermissionAlert = true,
    showServicesAlert = true,
    fallbackToYaounde = true,
    enableHighAccuracy = false, // Default to false for better performance
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
    setBatch,
  } = useLocationStore();

  // Stable refs to prevent infinite loops
  const isRequestingRef = useRef(false);
  const initializationDoneRef = useRef(false);
  const optionsRef = useRef(options);

  // Update options ref when options change
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  // Memoize stable functions
  const checkServices = useCallback(async (): Promise<boolean> => {
    try {
      const enabled = await LocationService.areLocationServicesEnabled();
      setServicesEnabled(enabled);
      
      if (!enabled && optionsRef.current.showServicesAlert) {
        Alert.alert(
          'Services de localisation désactivés',
          'Veuillez activer les services de localisation dans les paramètres de votre appareil pour une meilleure expérience.',
          [
            { text: 'Annuler', style: 'cancel' },
            {
              text: 'Ouvrir les paramètres',
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
  }, [setServicesEnabled]);

  const checkPermission = useCallback(async (): Promise<boolean> => {
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

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (isRequestingRef.current) return false;

    try {
      isRequestingRef.current = true;
      
      // Batch updates for better performance
      setBatch({
        isLoading: true,
        error: null,
      });
      
      setPermissionRequested(true);

      const granted = await LocationService.requestPermission();
      setPermission(granted);

      if (!granted && optionsRef.current.showPermissionAlert) {
        Alert.alert(
          'Autorisation de localisation refusée',
          'L\'accès à la localisation a été refusé. Nous utiliserons Yaoundé comme localisation par défaut. Vous pouvez activer l\'accès à la localisation plus tard dans les paramètres.',
          [
            { text: 'OK', style: 'default' },
            {
              text: 'Ouvrir les paramètres',
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
      setLoading(false);
      isRequestingRef.current = false;
    }
  }, [setBatch, setPermissionRequested, setPermission, setError, setLoading]);

  const getCurrentLocation = useCallback(async (forceRefresh = false): Promise<boolean> => {
    if (isRequestingRef.current) return false;

    try {
      isRequestingRef.current = true;
      
      // Batch initial state update
      setBatch({
        isLoading: true,
        error: null,
      });

      // Clear cache if force refresh
      if (forceRefresh) {
        LocationService.clearCache();
      }

      const result = await LocationService.getCurrentLocation({
        enableHighAccuracy: optionsRef.current.enableHighAccuracy,
        fallbackToYaounde: optionsRef.current.fallbackToYaounde,
      });

      // Batch final state update
      setBatch({
        location: result.location || null,
        error: result.error || null,
        isLoading: false,
      });

      return result.success;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get location';
      console.warn('useLocation: Error getting location:', errorMessage);
      
      // Batch error state with fallback
      if (optionsRef.current.fallbackToYaounde) {
        const fallbackLocation = LocationService.getFallbackLocation();
        setBatch({
          location: fallbackLocation,
          error: errorMessage,
          isLoading: false,
        });
      } else {
        setBatch({
          error: errorMessage,
          isLoading: false,
        });
      }
      
      return false;
    } finally {
      isRequestingRef.current = false;
    }
  }, [setBatch]);

  // Initialize location only once with stable dependencies
  useEffect(() => {
    if (!autoInit || initializationDoneRef.current) return;

    const initializeLocation = async () => {
      if (isRequestingRef.current) return;
      
      try {
        initializationDoneRef.current = true;

        // Check services and permission
        const [servicesOk, hasPermissionNow] = await Promise.all([
          LocationService.areLocationServicesEnabled(),
          LocationService.getPermissionStatus(),
        ]);

        setBatch({
          servicesEnabled: servicesOk,
          hasPermission: hasPermissionNow === PermissionStatus.GRANTED,
        });

        if (!servicesOk) {
          // Services disabled, use fallback
          if (fallbackToYaounde) {
            const fallbackLocation = LocationService.getFallbackLocation();
            setBatch({
              location: fallbackLocation,
              isLoading: false,
            });
          }
          return;
        }

        if (hasPermissionNow === PermissionStatus.GRANTED) {
          // Permission granted, get location
          await getCurrentLocation();
        } else if (!permissionRequested && hasPermissionNow === PermissionStatus.UNDETERMINED) {
          // Permission not requested yet, try to request it
          const granted = await LocationService.requestPermission();
          setBatch({
            hasPermission: granted,
            permissionRequested: true,
          });
          
          if (granted) {
            await getCurrentLocation();
          } else if (fallbackToYaounde) {
            const fallbackLocation = LocationService.getFallbackLocation();
            setBatch({
              location: fallbackLocation,
              isLoading: false,
            });
          }
        } else if (fallbackToYaounde) {
          // Permission was denied previously, use fallback
          const fallbackLocation = LocationService.getFallbackLocation();
          setBatch({
            location: fallbackLocation,
            isLoading: false,
          });
        }
      } catch (error) {
        console.warn('useLocation: Error initializing location:', error);
        if (fallbackToYaounde) {
          const fallbackLocation = LocationService.getFallbackLocation();
          setBatch({
            location: fallbackLocation,
            error: error instanceof Error ? error.message : 'Initialization failed',
            isLoading: false,
          });
        }
      }
    };

    initializeLocation();

    // Cleanup function
    return () => {
      isRequestingRef.current = false;
    };
  }, [autoInit, fallbackToYaounde]); // Minimal, stable dependencies

  // Refresh location with proper cleanup
  const refreshLocation = useCallback(async (): Promise<boolean> => {
    return getCurrentLocation(true);
  }, [getCurrentLocation]);

  // Memoized computed values to prevent unnecessary re-renders
  const computedValues = useMemo(() => ({
    hasValidLocation: location !== null,
    isUsingFallback: location?.isFallback ?? false,
    canRequestLocation: servicesEnabled && !hasPermission && !isLoading,
  }), [location, servicesEnabled, hasPermission, isLoading]);

  return {
    // State
    location,
    isLoading,
    error,
    hasPermission,
    permissionRequested,
    servicesEnabled,
    ...computedValues,

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
