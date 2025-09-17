import * as ExpoLocation from 'expo-location';
import { LOCATION_CONFIG, YAOUNDE_CENTER, isValidCameroonCoordinate } from './constants';
import { Coordinates, Location, LocationResult, PermissionStatus } from './types';

class LocationService {
  private static instance: LocationService;
  private currentLocation: Location | null = null;
  private cacheTimestamp = 0;
  private lastPermissionRequest = 0;

  static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  async isLocationEnabled(): Promise<boolean> {
    try {
      return await ExpoLocation.hasServicesEnabledAsync();
    } catch (error) {
      console.warn('Error checking location services:', error);
      return false;
    }
  }

  async getPermissionStatus(): Promise<PermissionStatus> {
    try {
      const { status } = await ExpoLocation.getForegroundPermissionsAsync();
      switch (status) {
        case 'granted':
          return PermissionStatus.GRANTED;
        case 'denied':
          return PermissionStatus.DENIED;
        default:
          return PermissionStatus.NOT_REQUESTED;
      }
    } catch (error) {
      console.warn('Error getting permission status:', error);
      return PermissionStatus.NOT_REQUESTED;
    }
  }

  async requestPermission(): Promise<{
    granted: boolean;
    status: PermissionStatus;
    shouldShowRationale?: boolean;
  }> {
    const now = Date.now();
    
    // Prevent spam permission requests
    if (now - this.lastPermissionRequest < LOCATION_CONFIG.PERMISSION_COOLDOWN) {
      const currentStatus = await this.getPermissionStatus();
      return {
        granted: currentStatus === PermissionStatus.GRANTED,
        status: currentStatus,
      };
    }

    try {
      this.lastPermissionRequest = now;
      const result = await ExpoLocation.requestForegroundPermissionsAsync();
      
      const status = result.status === 'granted' 
        ? PermissionStatus.GRANTED 
        : PermissionStatus.DENIED;

      return {
        granted: result.status === 'granted',
        status,
        shouldShowRationale: result.canAskAgain === false,
      };
    } catch (error) {
      console.warn('Error requesting permission:', error);
      return {
        granted: false,
        status: PermissionStatus.DENIED,
      };
    }
  }

  async getCurrentLocation(forceRefresh = false): Promise<LocationResult> {
    try {
      // Return cached location if valid and not forcing refresh
      if (
        !forceRefresh &&
        this.currentLocation &&
        Date.now() - this.cacheTimestamp < LOCATION_CONFIG.CACHE_DURATION
      ) {
        return {
          success: true,
          location: this.currentLocation,
          fromCache: true,
        };
      }

      // Check if location services are enabled
      const servicesEnabled = await this.isLocationEnabled();
      if (!servicesEnabled) {
        return this.getFallbackLocation('Location services are disabled');
      }

      // Check permission
      const permission = await this.getPermissionStatus();
      if (permission !== PermissionStatus.GRANTED) {
        return this.getFallbackLocation('Location permission not granted');
      }

      // Get GPS location with timeout
      const position = await Promise.race([
        ExpoLocation.getCurrentPositionAsync({
          accuracy: ExpoLocation.Accuracy.Balanced,
        }),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('GPS timeout')), LOCATION_CONFIG.GPS_TIMEOUT)
        ),
      ]);

      const coordinates: Coordinates = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      // Validate coordinates
      if (!isValidCameroonCoordinate(coordinates)) {
        return this.getFallbackLocation('Location outside service area');
      }

      // Reverse geocode
      const address = await this.reverseGeocode(coordinates);

      const location: Location = {
        ...coordinates,
        city: 'Yaoundé',
        exactLocation: address.exactLocation,
        formattedAddress: address.formattedAddress,
        isFallback: false,
        timestamp: Date.now(),
      };

      // Cache the location
      this.currentLocation = location;
      this.cacheTimestamp = Date.now();

      return {
        success: true,
        location,
        fromCache: false,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get location';
      console.warn('Error getting current location:', errorMessage);
      return this.getFallbackLocation(errorMessage);
    }
  }

  private async reverseGeocode(coordinates: Coordinates): Promise<{
    exactLocation: string;
    formattedAddress: string;
  }> {
    try {
      const geocodeResult = await ExpoLocation.reverseGeocodeAsync(coordinates);

      if (!geocodeResult || geocodeResult.length === 0) {
        return {
          exactLocation: 'Yaoundé',
          formattedAddress: 'Yaoundé, Cameroun',
        };
      }

      const result = geocodeResult[0];
      let exactLocation = 'Yaoundé';
      
      if (result.street) {
        exactLocation = result.street;
      } else if (result.district) {
        exactLocation = result.district;
      } else if (result.subregion) {
        exactLocation = result.subregion;
      }

      const addressParts = [
        result.street,
        result.district || result.subregion,
        result.city || 'Yaoundé',
        'Cameroun',
      ].filter(Boolean);

      return {
        exactLocation,
        formattedAddress: addressParts.join(', '),
      };
    } catch (error) {
      console.warn('Reverse geocoding failed:', error);
      return {
        exactLocation: 'Yaoundé',
        formattedAddress: 'Yaoundé, Cameroun',
      };
    }
  }

  private getFallbackLocation(reason?: string): LocationResult {
    const location: Location = {
      ...YAOUNDE_CENTER,
      city: 'Yaoundé',
      exactLocation: 'Centre-ville, Yaoundé',
      formattedAddress: 'Centre-ville, Yaoundé, Cameroun',
      isFallback: true,
      timestamp: Date.now(),
    };

    this.currentLocation = location;
    this.cacheTimestamp = Date.now();

    return {
      success: true,
      location,
      error: reason,
    };
  }

  getDefaultCoordinates(): Coordinates {
    return YAOUNDE_CENTER;
  }

  clearCache(): void {
    this.currentLocation = null;
    this.cacheTimestamp = 0;
  }

  getCachedLocation(): Location | null {
    if (
      this.currentLocation &&
      Date.now() - this.cacheTimestamp < LOCATION_CONFIG.CACHE_DURATION
    ) {
      return this.currentLocation;
    }
    return null;
  }
}

export default LocationService.getInstance();
