// src/location/LocationService.ts - Simple MVP implementation
import * as Location from 'expo-location';
import { Coordinates, ManualAddressInput, GeocodeResponse } from './types';

// Yaoundé center for MVP
const YAOUNDE_CENTER: Coordinates = {
  latitude: 3.8667,
  longitude: 11.5167
};

class LocationService {
  private static instance: LocationService;

  static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  // Simple permission check
  async checkPermission(): Promise<boolean> {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      return status === 'granted';
    } catch {
      return false;
    }
  }

  // Simple permission request
  async requestPermission(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch {
      return false;
    }
  }

  // Get GPS location with simple timeout
  async getCurrentLocation(): Promise<Coordinates | null> {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 5000,
      });

      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      // Basic validation for Cameroon
      if (this.isValidLocation(coords)) {
        return coords;
      }

      return YAOUNDE_CENTER;
    } catch {
      return null;
    }
  }

  // Simple location validation
  private isValidLocation(coords: Coordinates): boolean {
    return (
      coords.latitude >= 1.0 && coords.latitude <= 13.0 &&
      coords.longitude >= 8.0 && coords.longitude <= 16.0
    );
  }

  // Simple address processing for MVP
  async geocodeAddress(addressInput: ManualAddressInput): Promise<GeocodeResponse> {
    try {
      const formattedAddress = `${addressInput.street}${addressInput.landmark ? `, ${addressInput.landmark}` : ''}, Yaoundé`;

      return {
        success: true,
        coordinates: YAOUNDE_CENTER,
        formattedAddress,
      };
    } catch {
      return {
        success: false,
        error: 'Failed to process address',
      };
    }
  }

  // Simple reverse geocoding
  async reverseGeocode(coords: Coordinates): Promise<string> {
    return this.isValidLocation(coords) ? 'Yaoundé, Cameroun' : 'Location inconnue';
  }

  // Get default location
  getDefaultLocation(): Coordinates {
    return YAOUNDE_CENTER;
  }

  // Validate address input
  validateAddress(addressInput: ManualAddressInput): boolean {
    return !!(addressInput.street?.trim());
  }
}

export default LocationService.getInstance();
