// src/location/types.ts - Simplified MVP types
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Address {
  id: string;
  street: string;
  landmark?: string;
  fullAddress: string;
  coordinates: Coordinates;
  isDefault: boolean;
  isGPSLocation: boolean;
  isFallback: boolean;
  createdAt: string;
}

export interface ManualAddressInput {
  street: string;
  landmark?: string;
  label?: 'Home' | 'Work' | 'Other';
}

export interface GeocodeResponse {
  success: boolean;
  coordinates?: Coordinates;
  formattedAddress?: string;
  error?: string;
}

export interface LocationPermissionOptions {
  autoInit?: boolean;
  fallbackToYaounde?: boolean;
}

export interface LocationState {
  currentLocation: Address | null;
  savedAddresses: Address[];
  isLoading: boolean;
  hasPermission: boolean;
  permissionStatus: 'undetermined' | 'granted' | 'denied';
  lastError: string | null;
  isUsingFallback: boolean;
}
