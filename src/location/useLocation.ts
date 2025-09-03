// src/location/useLocation.ts - Simple MVP hook
import { useEffect, useCallback, useRef, useMemo } from 'react';
import LocationService from './LocationService';
import {
  useLocationStore,
  useCurrentLocation,
  useLocationLoading,
  useLocationError,
  useLocationPermission,
  useLocationActions,
} from './store';
import { ManualAddressInput, Address } from './types';

interface UseLocationOptions {
  autoInit?: boolean;
  fallbackToYaounde?: boolean;
  onLocationChange?: (location: Address | null) => void;
  onError?: (error: string) => void;
}

// Simple debounce hook
function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<number | null>(null);

  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]) as T;
}

export const useLocation = (options: UseLocationOptions = {}) => {
  const {
    autoInit = false,
    fallbackToYaounde = true,
    onLocationChange,
    onError,
  } = options;

  const currentLocation = useCurrentLocation();
  const isLoading = useLocationLoading();
  const lastError = useLocationError();
  const { hasPermission, status: permissionStatus } = useLocationPermission();

  const {
    setCurrentLocation,
    addSavedAddress,
    setLoading,
    setPermission,
    setError,
    clearError,
    createAddress,
    createFallbackAddress,
    setUsingFallback,
  } = useLocationActions();

  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const debouncedLocationChange = useDebounce(
    useCallback((location: Address | null) => {
      if (mountedRef.current) {
        onLocationChange?.(location);
      }
    }, [onLocationChange]),
    300
  );

  const debouncedErrorCallback = useDebounce(
    useCallback((error: string) => {
      if (mountedRef.current) {
        onError?.(error);
      }
    }, [onError]),
    300
  );

  useEffect(() => {
    if (mountedRef.current) {
      debouncedLocationChange(currentLocation);
    }
  }, [currentLocation?.id, currentLocation?.coordinates?.latitude, currentLocation?.coordinates?.longitude, debouncedLocationChange]);

  useEffect(() => {
    if (mountedRef.current && lastError) {
      debouncedErrorCallback(lastError);
    }
  }, [lastError, debouncedErrorCallback]);

  const initializeLocation = useCallback(async () => {
    if (!mountedRef.current) return;

    try {
      setLoading(true);
      clearError();

      const permissionGranted = await LocationService.checkPermission();
      setPermission(permissionGranted, permissionGranted ? 'granted' : 'denied');

      if (permissionGranted) {
        const coords = await LocationService.getCurrentLocation();
        if (coords) {
          const addressText = await LocationService.reverseGeocode(coords);
          const gpsAddress = createAddress(
            'Position actuelle',
            coords,
            undefined,
            true
          );
          setCurrentLocation(gpsAddress);
          addSavedAddress(gpsAddress);
          setUsingFallback(false);
        } else if (fallbackToYaounde) {
          setFallbackLocation();
        }
      } else if (fallbackToYaounde) {
        setFallbackLocation();
      }
    } catch (error) {
      if (mountedRef.current) {
        setError('Impossible d\'initialiser la localisation');
        if (fallbackToYaounde) {
          setFallbackLocation();
        }
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [fallbackToYaounde, setCurrentLocation, addSavedAddress, setError, setLoading, setPermission, setUsingFallback, clearError]);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!mountedRef.current) return false;

    try {
      setLoading(true);
      clearError();

      const granted = await LocationService.requestPermission();
      setPermission(granted, granted ? 'granted' : 'denied');

      if (granted) {
        const coords = await LocationService.getCurrentLocation();
        if (coords) {
          const addressText = await LocationService.reverseGeocode(coords);
          const gpsAddress = createAddress(
            'Position actuelle',
            coords,
            undefined,
            true
          );
          setCurrentLocation(gpsAddress);
          addSavedAddress(gpsAddress);
          setUsingFallback(false);
          return true;
        }
      }
      return false;
    } catch (error) {
      if (mountedRef.current) {
        setError('Impossible de demander la permission');
      }
      return false;
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [setCurrentLocation, addSavedAddress, setError, setLoading, setPermission, setUsingFallback, clearError]);

  const setFallbackLocation = useCallback(() => {
    if (!mountedRef.current) return;

    try {
      const fallbackAddress = createFallbackAddress();
      setCurrentLocation(fallbackAddress);
      addSavedAddress(fallbackAddress);
      setUsingFallback(true);
      clearError();
    } catch {
      if (mountedRef.current) {
        setError('Impossible de définir la position par défaut');
      }
    }
  }, [setCurrentLocation, addSavedAddress, setError, setUsingFallback, clearError]);

  const refreshLocation = useCallback(async () => {
    if (!mountedRef.current) return false;

    if (hasPermission) {
      const coords = await LocationService.getCurrentLocation();
      if (coords) {
        const addressText = await LocationService.reverseGeocode(coords);
        const gpsAddress = createAddress(
          'Position actuelle',
          coords,
          undefined,
          true
        );
        setCurrentLocation(gpsAddress);
        addSavedAddress(gpsAddress);
        setUsingFallback(false);
        return true;
      }
      return false;
    } else {
      return await requestPermission();
    }
  }, [hasPermission, setCurrentLocation, addSavedAddress, setUsingFallback, requestPermission]);

  const addManualAddress = useCallback(async (
    addressInput: ManualAddressInput,
    setAsDefault = true
  ): Promise<boolean> => {
    if (!mountedRef.current) return false;

    try {
      setLoading(true);
      clearError();

      if (!LocationService.validateAddress(addressInput)) {
        throw new Error('Adresse invalide');
      }

      const geocodeResult = await LocationService.geocodeAddress(addressInput);
      if (!geocodeResult.success || !geocodeResult.coordinates) {
        throw new Error(geocodeResult.error || 'Impossible de traiter l\'adresse');
      }

      const newAddress = createAddress(
        addressInput.street,
        geocodeResult.coordinates,
        addressInput.landmark,
        false,
        addressInput.label
      );

      if (setAsDefault) {
        newAddress.isDefault = true;
        setCurrentLocation(newAddress);
      }

      addSavedAddress(newAddress);
      setUsingFallback(false);
      return true;
    } catch (error) {
      if (mountedRef.current) {
        setError(error instanceof Error ? error.message : 'Impossible d\'ajouter l\'adresse');
      }
      return false;
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [setCurrentLocation, addSavedAddress, setError, setLoading, setUsingFallback, clearError]);

  const selectAddress = useCallback((address: Address) => {
    if (mountedRef.current) {
      setCurrentLocation(address);
      setUsingFallback(address.isFallback);
      clearError();
    }
  }, [setCurrentLocation, setUsingFallback, clearError]);

  const hasValidLocation = useMemo(() => {
    return !!(currentLocation?.coordinates?.latitude && currentLocation?.coordinates?.longitude);
  }, [currentLocation?.coordinates]);

  const isUsingFallback = useMemo(() => {
    return currentLocation?.isFallback === true;
  }, [currentLocation?.isFallback]);

  const shouldShowPermissionModal = useMemo(() => {
    return !hasPermission &&
      permissionStatus === 'undetermined' &&
      !currentLocation &&
      !isLoading;
  }, [hasPermission, permissionStatus, currentLocation, isLoading]);

  return {
    location: currentLocation,
    isLoading,
    hasPermission,
    permissionStatus,
    error: lastError,
    hasValidLocation,
    isUsingFallback,
    shouldShowPermissionModal,

    initializeLocation,
    requestPermission,
    refreshLocation,
    addManualAddress,
    setFallbackLocation,
    selectAddress,
    clearError,
  };
};
