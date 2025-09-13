import { useCallback, useState } from 'react';
import { useLocation } from '@/src/location/useLocation';
import { useLocationActions, useSavedAddresses } from '@/src/location';
import { SavedAddress } from '@/src/location/types';

export interface AddressManagerResult {
  // Location state
  currentLocation: any;
  isLoadingLocation: boolean;
  locationError: string | null;
  hasLocationPermission: boolean;
  
  // Address state
  savedAddresses: SavedAddress[];
  isProcessing: boolean;
  
  // Actions
  getCurrentLocationForAddress: () => Promise<{
    success: boolean;
    address?: string;
    coordinates?: { latitude: number; longitude: number };
    error?: string;
  }>;
  requestLocationPermission: () => Promise<boolean>;
  addAddressFromCurrentLocation: (label: string) => Promise<boolean>;
  refreshLocation: () => Promise<boolean>;
}

export const useAddressManager = (): AddressManagerResult => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Location hooks
  const {
    location: currentLocation,
    isLoading: isLoadingLocation,
    error: locationError,
    hasPermission: hasLocationPermission,
    requestPermissionWithLocation,
    getCurrentLocation,
    refreshLocation,
    showLocationPermissionDialog,
  } = useLocation({
    autoRequest: true,
    requestOnMount: false,
  });

  // Address hooks
  const savedAddresses = useSavedAddresses();
  const { addSavedAddress } = useLocationActions();

  const getCurrentLocationForAddress = useCallback(async () => {
    try {
      setIsProcessing(true);

      // Check if we have permission
      if (!hasLocationPermission) {
        return {
          success: false,
          error: 'Location permission required',
        };
      }

      // Get current location
      const success = await getCurrentLocation(true);
      
      if (success && currentLocation) {
        return {
          success: true,
          address: currentLocation.formattedAddress || `${currentLocation.city}, Cameroon`,
          coordinates: {
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
          },
        };
      } else {
        return {
          success: false,
          error: locationError || 'Failed to get current location',
        };
      }
    } catch (error) {
      console.error('Error getting current location for address:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    } finally {
      setIsProcessing(false);
    }
  }, [hasLocationPermission, getCurrentLocation, currentLocation, locationError]);

  const requestLocationPermission = useCallback(async (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (hasLocationPermission) {
        resolve(true);
        return;
      }

      showLocationPermissionDialog(
        async () => {
          const granted = await requestPermissionWithLocation();
          resolve(granted);
        },
        () => {
          resolve(false);
        }
      );
    });
  }, [hasLocationPermission, showLocationPermissionDialog, requestPermissionWithLocation]);

  const addAddressFromCurrentLocation = useCallback(async (label: string): Promise<boolean> => {
    try {
      setIsProcessing(true);

      // First ensure we have permission
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        return false;
      }

      // Get current location
      const locationResult = await getCurrentLocationForAddress();
      if (!locationResult.success) {
        return false;
      }

      // Add the address
      addSavedAddress({
        label,
        street: locationResult.address || '',
        fullAddress: locationResult.address || '',
        coordinates: locationResult.coordinates || {
          latitude: 3.8667,
          longitude: 11.5167,
        },
        isDefault: savedAddresses.length === 0, // Make first address default
      });

      return true;
    } catch (error) {
      console.error('Error adding address from current location:', error);
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, [requestLocationPermission, getCurrentLocationForAddress, addSavedAddress, savedAddresses.length]);

  const handleRefreshLocation = useCallback(async (): Promise<boolean> => {
    try {
      setIsProcessing(true);
      return await refreshLocation();
    } finally {
      setIsProcessing(false);
    }
  }, [refreshLocation]);

  return {
    // Location state
    currentLocation,
    isLoadingLocation,
    locationError,
    hasLocationPermission,
    
    // Address state
    savedAddresses,
    isProcessing,
    
    // Actions
    getCurrentLocationForAddress,
    requestLocationPermission,
    addAddressFromCurrentLocation,
    refreshLocation: handleRefreshLocation,
  };
};