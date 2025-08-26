/**
 * Location Module - Simple, Production-Ready Location System
 * 
 * Features:
 * - Simple API with automatic Yaoundé fallback
 * - Permission handling with user-friendly alerts
 * - Caching for performance
 * - Store integration with persistence
 * - Clean, reusable components
 * - No distance calculations (as requested)
 * 
 * Usage:
 * ```tsx
 * import { useLocation, LocationPermissionModal } from '@/src/location';
 * 
 * const MyComponent = () => {
 *   const { 
 *     location, 
 *     isLoading, 
 *     hasPermission, 
 *     requestPermission,
 *     refreshLocation 
 *   } = useLocation();
 *   
 *   return (
 *     <View>
 *       <Text>Current location: {location?.city || 'Loading...'}</Text>
 *       <LocationPermissionModal 
 *         visible={!hasPermission && !location}
 *         onRequestPermission={requestPermission}
 *         onDeny={() => console.log('User denied permission')}
 *       />
 *     </View>
 *   );
 * };
 * ```
 */

// Types
export type { Location, LocationState, LocationOptions, LocationResult, PermissionStatus } from './types';

// Core service
export { default as LocationService } from './LocationService';

// Store
export { 
  useLocationStore, 
  useLocationData, 
  useLocationLoading, 
  useLocationError, 
  useLocationPermission,
  type LocationStore 
} from './store';

// Hook
export { useLocation } from './useLocation';

// Components
export { 
  LocationPermissionModal, 
  LocationStatus, 
  LocationRefreshButton 
} from './LocationPermissionModal';

