import * as ExpoLocation from 'expo-location';
import { Location, LocationResult, LocationOptions, PermissionStatus } from './types';

/**
 * Simple, production-ready LocationService
 * Features:
 * - Fallback to Yaoundé when permission denied or location unavailable
 * - Simple caching (5 minutes)
 * - Proper error handling
 * - No distance calculations
 * - Clean API
 */
class LocationService {
  private static instance: LocationService;
  private cachedLocation: Location | null = null;
  private cacheTimestamp = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private readonly DEFAULT_TIMEOUT = 15000; // 15 seconds

  // Yaoundé fallback location
  private readonly YAOUNDE_LOCATION: Omit<Location, 'timestamp'> = {
    latitude: 3.8480,
    longitude: 11.5021,
    city: 'Yaoundé',
    region: 'Centre',
    address: 'Yaoundé, Centre Region, Cameroon',
    isFallback: true,
  };

  public static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  /**
   * Get fallback location (Yaoundé)
   */
  public getFallbackLocation(): Location {
    return {
      ...this.YAOUNDE_LOCATION,
      timestamp: Date.now(),
    };
  }

  /**
   * Check if location services are enabled on the device
   */
  public async areLocationServicesEnabled(): Promise<boolean> {
    try {
      return await ExpoLocation.hasServicesEnabledAsync();
    } catch (error) {
      console.warn('LocationService: Error checking location services:', error);
      return false;
    }
  }

  /**
   * Get current permission status
   */
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

  /**
   * Request location permission from user
   */
  public async requestPermission(): Promise<boolean> {
    try {
      const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      return status === ExpoLocation.PermissionStatus.GRANTED;
    } catch (error) {
      console.warn('LocationService: Error requesting permission:', error);
      return false;
    }
  }

  /**
   * Check if cached location is still valid
   */
  private isCacheValid(): boolean {
    return (
      this.cachedLocation !== null &&
      Date.now() - this.cacheTimestamp < this.CACHE_DURATION
    );
  }

  /**
   * Get location from cache
   */
  private getCachedLocation(): Location | null {
    return this.isCacheValid() ? this.cachedLocation : null;
  }

  /**
   * Cache location data
   */
  private cacheLocation(location: Location): void {
    this.cachedLocation = location;
    this.cacheTimestamp = Date.now();
  }

  /**
   * Reverse geocode coordinates to address
   */
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
        const city = result.city || result.district || result.subregion || 'Unknown City';
        const region = result.region || result.country || 'Unknown Region';
        
        const addressParts = [
          result.streetNumber,
          result.street,
          city,
          region,
          result.country,
        ].filter(Boolean);
        
        const address = addressParts.length > 0 
          ? addressParts.join(', ')
          : `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

        return { city, region, address };
      }
    } catch (error) {
      console.warn('LocationService: Geocoding failed:', error);
    }

    // Fallback to coordinates if geocoding fails
    return {
      city: 'Unknown City',
      region: 'Unknown Region',
      address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
    };
  }

  /**
   * Get current user location
   * Returns cached location if valid, otherwise fetches new location
   * Falls back to Yaoundé if permission denied or location unavailable
   */
  public async getCurrentLocation(options: LocationOptions = {}): Promise<LocationResult> {
    const {
      enableHighAccuracy = true,
      timeout = this.DEFAULT_TIMEOUT,
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

      // Get current location
      const locationResult = await Promise.race([
        ExpoLocation.getCurrentPositionAsync({
          accuracy: enableHighAccuracy
            ? ExpoLocation.Accuracy.High
            : ExpoLocation.Accuracy.Balanced,
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Location request timeout')), timeout)
        ),
      ]);

      const { latitude, longitude } = locationResult.coords;

      // Reverse geocode to get address info
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

  /**
   * Clear location cache (useful for testing or forced refresh)
   */
  public clearCache(): void {
    this.cachedLocation = null;
    this.cacheTimestamp = 0;
  }

  /**
   * Check if location can be obtained (services enabled + permission granted)
   */
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
