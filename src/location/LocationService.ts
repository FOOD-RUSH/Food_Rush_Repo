import * as ExpoLocation from 'expo-location';
import { Location, LocationResult, LocationOptions, PermissionStatus } from './types';

/**
 * Optimized LocationService for Cameroon
 * Features:
 * - No timeout (removed for network reliability)
 * - Extended caching (15 minutes)
 * - Proper error handling for poor network conditions
 * - Thread-safe operations
 * - YaoundÃ© fallback with precise coordinates
 */
class LocationService {
  private static instance: LocationService;
  private cachedLocation: Location | null = null;
  private cacheTimestamp = 0;
  private readonly CACHE_DURATION = 15 * 60 * 1000; // 15 minutes for better performance
  private currentRequest: Promise<LocationResult> | null = null;

  // Precise YaoundÃ© coordinates (Centre-ville area)
  private readonly YAOUNDE_LOCATION: Omit<Location, 'timestamp'> = {
    latitude: 3.8480,
    longitude: 11.5021,
    city: 'Yaoundé',
    region: 'Centre',
    address: 'Centre-ville, Yaoundé, Région du Centre, Cameroun',
    isFallback: true,
  };

  public static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  public getFallbackLocation(): Location {
    return {
      ...this.YAOUNDE_LOCATION,
      timestamp: Date.now(),
    };
  }

  public async areLocationServicesEnabled(): Promise<boolean> {
    try {
      return await ExpoLocation.hasServicesEnabledAsync();
    } catch (error) {
      console.warn('LocationService: Error checking location services:', error);
      return false;
    }
  }

  public async getPermissionStatus(): Promise<PermissionStatus> {
    try {
      const { status } = await ExpoLocation.getForegroundPermissionsAsync();
      
      switch (status) {
        case ExpoLocation.PermissionStatus.GRANTED:
          return PermissionStatus.GRANTED;
        case ExpoLocation.PermissionStatus.DENIED:
          return PermissionStatus.DENIED;
        default:
          return PermissionStatus.UNDETERMINED;
      }
    } catch (error) {
      console.warn('LocationService: Error getting permission status:', error);
      return PermissionStatus.DENIED;
    }
  }

  public async requestPermission(): Promise<boolean> {
    try {
      const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      return status === ExpoLocation.PermissionStatus.GRANTED;
    } catch (error) {
      console.warn('LocationService: Error requesting permission:', error);
      return false;
    }
  }

  private isCacheValid(): boolean {
    return (
      this.cachedLocation !== null &&
      Date.now() - this.cacheTimestamp < this.CACHE_DURATION
    );
  }

  private getCachedLocation(): Location | null {
    return this.isCacheValid() ? this.cachedLocation : null;
  }

  private cacheLocation(location: Location): void {
    this.cachedLocation = location;
    this.cacheTimestamp = Date.now();
  }

  private async reverseGeocode(latitude: number, longitude: number): Promise<{
    city: string;
    region: string;
    address: string;
  }> {
    try {
      const results = await ExpoLocation.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (results && results.length > 0) {
        const result = results[0];
        const city = result.city || result.district || result.subregion || 'Yaoundé';
        const region = result.region || 'Centre';
        
        const addressParts = [
          result.streetNumber,
          result.street,
          city,
          region,
          'Cameroun',
        ].filter(Boolean);
        
        const address = addressParts.length > 0 
          ? addressParts.join(', ')
          : `${city}, ${region}`;

        return { city, region, address };
      }
    } catch (error) {
      console.warn('LocationService: Geocoding failed:', error);
    }

    // Fallback to Yaoundé if geocoding fails
    return {
      city: 'Yaoundé',
      region: 'Centre',
      address: 'Yaoundé, Centre, Cameroun',
    };
  }

  /**
   * Get current user location with thread safety
   * No timeout for better reliability in poor network conditions
   */
  public async getCurrentLocation(options: LocationOptions = {}): Promise<LocationResult> {
    const {
      enableHighAccuracy = false, // Default to false for better performance
      fallbackToYaounde = true,
    } = options;

    // Return cached location if valid
    const cached = this.getCachedLocation();
    if (cached) {
      return {
        success: true,
        location: cached,
      };
    }

    // Prevent concurrent requests
    if (this.currentRequest) {
      return this.currentRequest;
    }

    this.currentRequest = this._getCurrentLocationInternal(enableHighAccuracy, fallbackToYaounde);
    
    try {
      return await this.currentRequest;
    } finally {
      this.currentRequest = null;
    }
  }

  private async _getCurrentLocationInternal(
    enableHighAccuracy: boolean,
    fallbackToYaounde: boolean
  ): Promise<LocationResult> {
    try {
      // Check if location services are enabled
      const servicesEnabled = await this.areLocationServicesEnabled();
      if (!servicesEnabled) {
        const fallbackLocation = this.getFallbackLocation();
        if (fallbackToYaounde) {
          this.cacheLocation(fallbackLocation);
        }
        return {
          success: false,
          location: fallbackToYaounde ? fallbackLocation : undefined,
          error: 'Location services are disabled',
        };
      }

      // Check permission
      const permissionStatus = await this.getPermissionStatus();
      if (permissionStatus !== PermissionStatus.GRANTED) {
        const fallbackLocation = this.getFallbackLocation();
        if (fallbackToYaounde) {
          this.cacheLocation(fallbackLocation);
        }
        return {
          success: false,
          location: fallbackToYaounde ? fallbackLocation : undefined,
          error: 'Location permission not granted',
        };
      }

      // Get current location - NO TIMEOUT for reliability
      const locationResult = await ExpoLocation.getCurrentPositionAsync({
        accuracy: enableHighAccuracy
          ? ExpoLocation.Accuracy.High
          : ExpoLocation.Accuracy.Low, // Use Low for better performance in Cameroon
      });

      const { latitude, longitude } = locationResult.coords;

      // Reverse geocode with fallback
      const { city, region, address } = await this.reverseGeocode(latitude, longitude);

      const location: Location = {
        latitude,
        longitude,
        city,
        region,
        address,
        isFallback: false,
        timestamp: Date.now(),
      };

      this.cacheLocation(location);

      return {
        success: true,
        location,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.warn('LocationService: Error getting location:', errorMessage);

      // Return fallback location on error
      if (fallbackToYaounde) {
        const fallbackLocation = this.getFallbackLocation();
        this.cacheLocation(fallbackLocation);
        return {
          success: false,
          location: fallbackLocation,
          error: errorMessage,
        };
      }

      return {
        success: false,
        location: undefined,
        error: errorMessage,
      };
    }
  }

  public clearCache(): void {
    this.cachedLocation = null;
    this.cacheTimestamp = 0;
    this.currentRequest = null;
  }

  public async canGetLocation(): Promise<boolean> {
    try {
      const [servicesEnabled, permissionStatus] = await Promise.all([
        this.areLocationServicesEnabled(),
        this.getPermissionStatus(),
      ]);

      return servicesEnabled && permissionStatus === PermissionStatus.GRANTED;
    } catch (error) {
      console.warn('LocationService: Error checking location availability:', error);
      return false;
    }
  }
}

// Export singleton instance
export default LocationService.getInstance();
