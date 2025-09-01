/**
 * Location Module - Performance Optimized for Cameroon Food Delivery
 * 
 * Key Performance Improvements:
 * - Removed timeouts for network reliability
 * - Extended caching (15 minutes)
 * - Batched store updates to prevent excessive re-renders
 * - Fixed infinite render loops in useLocation hook
 * - Optimized modal rendering with early returns
 * - Thread-safe location operations
 * - Precise Yaoundé fallback coordinates
 * 
 * Features:
 * - Simple API with automatic Yaoundé fallback
 * - Robust permission handling optimized for African networks
 * - Performance monitoring and caching
 * - Store integration with persistence
 * - Clean, reusable components
 * - Optimized for poor network conditions
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
 *   } = useLocation({
 *     autoInit: true,
 *     fallbackToYaounde: true,
 *     enableHighAccuracy: false, // Better for Cameroon networks
 *   });
 *   
 *   return (
 *     <View>
 *       <Text>Localisation: {location?.city || 'Chargement...'}</Text>
 *       {!hasPermission && !location && (
 *         <LocationPermissionModal 
 *           visible={true}
 *           onRequestPermission={requestPermission}
 *           onDeny={() => console.log('Permission refusée')}
 *           onClose={() => {}}
 *         />
 *       )}
 *     </View>
 *   );
 * };
 * ```
 */

// Types
export type { 
  Location, 
  LocationState, 
  LocationOptions, 
  LocationResult, 
  PermissionStatus,
  LocationPerformanceMetrics 
} from './types';

// Core service
export { default as LocationService } from './LocationService';

// Store with performance optimizations
export { 
  useLocationStore, 
  useLocationData, 
  useLocationLoading, 
  useLocationError, 
  useLocationPermission,
  useLocationStatus,
  useLocationInfo,
  type LocationStore 
} from './store';

// Hook with fixed infinite render loop
export { useLocation } from './useLocation';

// Components with performance optimizations
export { 
  LocationPermissionModal, 
  LocationStatus, 
  LocationRefreshButton 
} from './LocationPermissionModal';

// Performance tips for implementation:
// 1. Use enableHighAccuracy: false for better performance in Cameroon
// 2. The system now has no timeout limits for better network reliability
// 3. Cache duration is extended to 15 minutes to reduce API calls
// 4. Use batched store updates when possible
// 5. Modal only renders when visible
// 6. All components are memoized to prevent unnecessary re-renders
