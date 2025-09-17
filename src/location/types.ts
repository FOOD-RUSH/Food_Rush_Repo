export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Location extends Coordinates {
  city: string;
  neighborhood?: string;
  landmark?: string;
  formattedAddress: string;
  exactLocation?: string;
  isFallback: boolean;
  timestamp: number;
}

export interface SavedAddress {
  id: string;
  label: string; // 'Home', 'Work', 'Other'
  street: string;
  neighborhood?: string;
  landmark?: string;
  fullAddress: string;
  coordinates: Coordinates;
  deliveryInstructions?: string;
  isDefault: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface LocationResult {
  success: boolean;
  location?: Location;
  error?: string;
  fromCache?: boolean;
}

export interface LocationOptions {
  timeout?: number;
  enableHighAccuracy?: boolean;
  fallbackToYaounde?: boolean;
  maxAge?: number;
}

export enum PermissionStatus {
  GRANTED = 'granted',
  DENIED = 'denied',
  NOT_REQUESTED = 'not_requested',
  RESTRICTED = 'restricted',
}

export interface LocationState {
  location: Location | null;
  savedAddresses: SavedAddress[];
  defaultAddressId: string | null;
  isLoading: boolean;
  error: string | null;
  hasPermission: boolean;
  permissionRequested: boolean;
  servicesEnabled: boolean;
  lastPermissionRequest: number;
}
