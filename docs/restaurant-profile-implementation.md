# Restaurant Profile Implementation

## Overview

This document describes the implementation of the new restaurant profile system that fetches detailed restaurant data from the `/restaurants/{id}` API endpoint and manages it efficiently across the application.

## Key Features

### 1. Session-Based Profile Loading
- Restaurant profile is fetched once per login session when the account screen is first visited
- Uses session tracking to avoid unnecessary API calls
- Automatically loads profile data when needed

### 2. Detailed Restaurant Profile Structure
The new `DetailedRestaurantProfile` interface includes all fields from the API response:

```typescript
interface DetailedRestaurantProfile {
  id: string;
  name: string;
  address: string;
  phone: string | null;
  isOpen: boolean;
  latitude: number | null;
  longitude: number | null;
  verificationStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  documentUrl: string | null;
  rating: number | null;
  ratingCount: number;
  ownerId: string;
  menuMode: 'FIXED' | 'DYNAMIC';
  timezone: string;
  deliveryBaseFee: number | null;
  deliveryPerKmRate: number | null;
  deliveryMinFee: number | null;
  deliveryMaxFee: number | null;
  deliveryFreeThreshold: number | null;
  deliverySurgeMultiplier: number | null;
  createdAt: string;
  updatedAt: string;
}
```

### 3. Status Toggle Integration
- When restaurant status is toggled (open/closed), the API returns the complete updated restaurant profile
- The store is updated with the full profile data, ensuring consistency
- UI reflects changes immediately with optimistic updates

## Architecture

### Store Structure
```
src/stores/restaurantStores/
├── restaurantProfileStore.ts    # Main restaurant profile store
├── notificationStore.ts         # Existing notification store
└── index.ts                     # Export all stores
```

### Hook Structure
```
src/hooks/restaurant/
├── useRestaurantProfile.ts      # Main profile management hook
└── useRestaurantApi.ts          # Existing API hooks
```

## Implementation Details

### 1. Restaurant Profile Store (`restaurantProfileStore.ts`)

**State Management:**
- `restaurantProfile`: Detailed restaurant data
- `isLoading`: Loading state for profile fetch
- `isUpdating`: Loading state for status updates
- `hasLoadedProfile`: Track if profile has been loaded in current session
- `lastLoginSession`: Session tracking for profile loading

**Key Actions:**
- `fetchRestaurantProfile()`: Fetch profile from API
- `updateRestaurantProfile()`: Update profile data
- `updateIsOpen()`: Update restaurant open/closed status
- `setLoginSession()`: Set current login session
- `shouldFetchProfile()`: Check if profile needs to be fetched

### 2. Restaurant Profile Hook (`useRestaurantProfile.ts`)

**Features:**
- Session-based profile loading
- Status toggle with API integration
- Error handling and loading states
- Optimistic UI updates

**Key Functions:**
- `loadProfileIfNeeded()`: Load profile if not already loaded for current session
- `toggleRestaurantStatus()`: Toggle open/closed status with API call
- `getRestaurantStatus()`: Get current restaurant status

### 3. AuthStore Integration

**Login Process:**
1. User logs in and receives restaurant data
2. Basic restaurant info is stored in AuthStore (existing functionality)
3. New session ID is generated and stored in restaurant profile store
4. Basic profile data is mapped to detailed structure for immediate use
5. Full profile will be fetched when account screen is first visited

**Logout Process:**
1. All stores are cleared including restaurant profile store
2. Session tracking is reset

### 4. Account Screen Updates

**Profile Loading:**
- `useEffect` hook calls `loadProfileIfNeeded()` when screen mounts
- Profile is fetched only if not already loaded for current session
- Loading states are managed for better UX

**Status Toggle:**
- Uses new `toggleStatus()` function from hook
- Optimistic UI updates for immediate feedback
- Full profile data is updated from API response

## API Integration

### Endpoints Used

1. **GET `/restaurants/{id}`**
   - Fetches complete restaurant profile
   - Called once per session when account screen is visited
   - Response structure matches `DetailedRestaurantProfile`

2. **PATCH `/restaurants/{id}/status`**
   - Updates restaurant open/closed status
   - Returns complete updated restaurant profile
   - Used for status toggle functionality

### Response Format
```json
{
  "status_code": 200,
  "message": "Restaurant retrieved successfully",
  "data": {
    "id": "restaurant-id",
    "name": "Restaurant Name",
    "address": "Restaurant Address",
    "phone": "+1234567890",
    "isOpen": true,
    // ... other fields
  }
}
```

## Usage Examples

### Loading Restaurant Profile
```typescript
const { loadProfileIfNeeded, restaurantProfile, isLoading } = useRestaurantProfile();

useEffect(() => {
  loadProfileIfNeeded();
}, [loadProfileIfNeeded]);
```

### Toggling Restaurant Status
```typescript
const { toggleStatus, isUpdating } = useRestaurantStatus();

const handleToggle = async () => {
  try {
    await toggleStatus(!isOpen);
  } catch (error) {
    console.error('Failed to toggle status:', error);
  }
};
```

### Accessing Restaurant Data
```typescript
const { restaurantProfile } = useRestaurantProfile();

// Access any field from the detailed profile
const deliveryFee = restaurantProfile?.deliveryBaseFee;
const rating = restaurantProfile?.rating;
const verificationStatus = restaurantProfile?.verificationStatus;
```

## Benefits

1. **Reduced API Calls**: Profile is fetched once per session
2. **Data Consistency**: All restaurant data comes from single source
3. **Better UX**: Optimistic updates for status changes
4. **Maintainable**: Clear separation of concerns
5. **Extensible**: Easy to add new restaurant-related features

## Testing

The implementation includes comprehensive tests for:
- Store state management
- Session tracking
- Profile updates
- Error handling

Run tests with:
```bash
npm test src/stores/restaurantStores/__tests__/restaurantProfileStore.test.ts
```

## Migration Notes

### For Existing Code
- Old `useCurrentRestaurant()` from AuthStore still works for basic data
- New `useRestaurantProfile()` provides detailed data
- Status toggle now uses new hook but maintains same UX

### Breaking Changes
- None - implementation is backward compatible
- Existing functionality continues to work as before
- New features are additive

## Future Enhancements

1. **Profile Editing**: Use detailed profile for restaurant settings
2. **Analytics Integration**: Leverage delivery fee data for insights
3. **Location Services**: Use latitude/longitude for map features
4. **Menu Management**: Integrate with menuMode field
5. **Verification Status**: Handle different verification states in UI