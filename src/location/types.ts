/**
 * Simplified Location Types for Food Rush App
 * Production-ready with essential functionality only
 */

export interface Location {
  latitude: number;
  longitude: number;
  city: string;
  region: string;
  address: string;
  isFallback: boolean;
  timestamp: number;
}

export enum PermissionStatus {
  GRANTED = 'granted',
  DENIED = 'denied',
  UNDETERMINED = 'undetermined',
}

export interface LocationState {
  location: Location | null;
  isLoading: boolean;
  error: string | null;
  hasPermission: boolean;
  permissionRequested: boolean;
  servicesEnabled: boolean;
}

export interface LocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  fallbackToYaounde?: boolean;
  requestPermissionOnDenied?: boolean;
}

export interface LocationResult {
  success: boolean;
  location?: Location;
  error?: string;
}
