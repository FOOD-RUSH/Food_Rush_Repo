export type {
  Location,
  LocationState,
  LocationOptions,
  LocationResult,
  PermissionStatus,
  SavedAddress,
  Coordinates,
} from './types';

export { default as LocationService } from './LocationService';

export {
  useLocationStore,
  useLocationData,
  useLocationLoading,
  useLocationError,
  useLocationPermission,
  useSavedAddresses,
  useDefaultAddressId,
  useDefaultAddress,
  useLocationActions,
  type LocationStore,
} from './store';

export { useLocation } from './useLocation';

export {
  LOCATION_CONFIG,
  YAOUNDE_CENTER,
  CAMEROON_BOUNDS,
  YAOUNDE_NEIGHBORHOODS,
  YAOUNDE_LANDMARKS,
  isValidCameroonCoordinate,
  formatYaoundeAddress,
} from './constants';
