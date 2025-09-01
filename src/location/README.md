# Food Rush Location System

A simple, production-ready location system with automatic fallback to Yaoundé, Cameroon.

## Features

- ✅ **Simple API** - Easy to use hooks and components
- ✅ **Automatic Fallback** - Falls back to Yaoundé when permission denied or location unavailable
- ✅ **Permission Handling** - User-friendly permission requests with alerts
- ✅ **Caching** - 5-minute location caching for performance
- ✅ **Store Integration** - Persistent state with Zustand + AsyncStorage
- ✅ **Production Ready** - Proper error handling and edge case management
- ✅ **No Distance Calculations** - As requested

## Quick Start

### Basic Usage

```tsx
import React from 'react';
import { View, Text } from 'react-native';
import { useLocation, LocationStatus, LocationRefreshButton } from '@/src/location';

const MyComponent = () => {
  const { 
    location, 
    isLoading, 
    hasPermission,
    refreshLocation,
    error 
  } = useLocation();

  return (
    <View>
      <Text>
        Current Location: {location ? `${location.city}, ${location.region}` : 'Loading...'}
      </Text>
      
      <LocationStatus 
        location={location}
        isLoading={isLoading}
        error={error}
        hasPermission={hasPermission}
      />
      
      <LocationRefreshButton 
        onRefresh={refreshLocation}
        isLoading={isLoading}
      />
    </View>
  );
};
```

### With Permission Modal

```tsx
import React, { useState } from 'react';
import { 
  useLocation, 
  LocationPermissionModal,
  LocationStatus 
} from '@/src/location';

const LocationAwareComponent = () => {
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  
  const { 
    location, 
    isLoading, 
    hasPermission, 
    canRequestLocation,
    requestPermission,
    setFallbackLocation 
  } = useLocation({
    autoInit: true,
    showPermissionAlert: false, // We'll handle this manually
  });

  const handleRequestPermission = async () => {
    const granted = await requestPermission();
    if (granted) {
      setShowPermissionModal(false);
    }
  };

  const handleDenyPermission = () => {
    setFallbackLocation();
    setShowPermissionModal(false);
  };

  // Show modal if we can request permission but don't have it
  React.useEffect(() => {
    if (canRequestLocation && !location) {
      setShowPermissionModal(true);
    }
  }, [canRequestLocation, location]);

  return (
    <View>
      <Text>Welcome to Food Rush!</Text>
      <LocationStatus 
        location={location}
        isLoading={isLoading}
        error={null}
        hasPermission={hasPermission}
      />
      
      <LocationPermissionModal
        visible={showPermissionModal}
        onRequestPermission={handleRequestPermission}
        onDeny={handleDenyPermission}
        onClose={() => setShowPermissionModal(false)}
        isLoading={isLoading}
      />
    </View>
  );
};
```

### Direct Store Usage

```tsx
import { useLocationStore } from '@/src/location';

const StoreExample = () => {
  const { location, isLoading, setFallbackLocation } = useLocationStore();
  
  return (
    <View>
      <Text>{location?.address || 'No location'}</Text>
      <Button 
        title="Use Yaoundé" 
        onPress={setFallbackLocation} 
      />
    </View>
  );
};
```

### Direct Service Usage

```tsx
import { LocationService } from '@/src/location';

const directServiceExample = async () => {
  // Check if location can be obtained
  const canGetLocation = await LocationService.canGetLocation();
  
  if (canGetLocation) {
    // Get current location
    const result = await LocationService.getCurrentLocation();
    if (result.success && result.location) {
      console.log('Location:', result.location);
    }
  } else {
    // Use fallback
    const fallback = LocationService.getFallbackLocation();
    console.log('Using fallback:', fallback);
  }
};
```

## API Reference

### `useLocation(options?)`

Main hook for location functionality.

**Options:**
- `autoInit: boolean` - Auto-initialize on mount (default: true)
- `showPermissionAlert: boolean` - Show permission alerts (default: true)
- `showServicesAlert: boolean` - Show services disabled alerts (default: true)
- `fallbackToYaounde: boolean` - Use Yaoundé fallback (default: true)
- `enableHighAccuracy: boolean` - Use high accuracy GPS (default: true)
- `timeout: number` - Location request timeout in ms (default: 15000)

**Returns:**
- `location: Location | null` - Current location
- `isLoading: boolean` - Loading state
- `error: string | null` - Error message
- `hasPermission: boolean` - Permission status
- `hasValidLocation: boolean` - Whether we have a location
- `isUsingFallback: boolean` - Whether using fallback location
- `getCurrentLocation: () => Promise<boolean>` - Get location manually
- `refreshLocation: () => Promise<boolean>` - Refresh location (clears cache)
- `requestPermission: () => Promise<boolean>` - Request location permission

### `LocationService`

Singleton service for location operations.

**Methods:**
- `getCurrentLocation(options?)` - Get current location
- `getFallbackLocation()` - Get Yaoundé fallback location
- `getPermissionStatus()` - Get permission status
- `requestPermission()` - Request permission
- `areLocationServicesEnabled()` - Check if services enabled
- `canGetLocation()` - Check if location can be obtained
- `clearCache()` - Clear location cache

### `LocationPermissionModal`

Modal component for requesting location permission.

**Props:**
- `visible: boolean` - Modal visibility
- `onRequestPermission: () => Promise<void>` - Permission request handler
- `onDeny: () => void` - Permission denial handler
- `onClose: () => void` - Modal close handler
- `isLoading?: boolean` - Loading state

### `LocationStatus`

Status indicator component.

**Props:**
- `location: Location | null` - Current location
- `isLoading: boolean` - Loading state
- `error: string | null` - Error message
- `hasPermission: boolean` - Permission status

## Migration from Old System

The old location system files have been backed up to `src/location-old-backup/`. 

To migrate:

1. Replace old imports:
   ```tsx
   // Old
   import { useOptimizedLocation } from '@/src/hooks/customer/useOptimizedLocation';
   import { useSimpleLocationStore } from '@/src/stores/customerStores/simpleLocationStore';
   
   // New
   import { useLocation } from '@/src/location';
   ```

2. Update hook usage:
   ```tsx
   // Old
   const { locationData, isLoading, getCurrentLocation } = useOptimizedLocation();
   
   // New
   const { location, isLoading, getCurrentLocation } = useLocation();
   ```

3. Update type imports:
   ```tsx
   // Old
   import { LocationData } from '@/src/types/location.types';
   
   // New
   import { Location } from '@/src/location';
   ```

## Yaoundé Fallback Details

When location access is denied or unavailable, the system automatically falls back to:

- **City:** Yaoundé
- **Region:** Centre
- **Address:** Yaoundé, Centre Region, Cameroon
- **Coordinates:** 3.8480°N, 11.5021°E
- **isFallback:** true

This ensures your app always has a location to work with, providing a smooth user experience even when location services are unavailable.
