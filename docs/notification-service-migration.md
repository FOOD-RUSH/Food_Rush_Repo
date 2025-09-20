# Notification Service Migration Guide

## Overview

The notification system has been unified to use a single shared service for both customer and restaurant user types. The backend determines the user type from the authentication token and returns appropriate notifications, eliminating the need for separate notification services.

## What Changed

### Before (Separate Services)
```
src/services/customer/notification.service.ts    # Customer notifications
src/services/restaurant/notificationApi.ts       # Restaurant notifications
src/stores/customerStores/notificationStore.ts   # Customer store
src/stores/restaurantStores/notificationStore.ts # Restaurant store
```

### After (Unified Service)
```
src/services/shared/notificationApi.ts           # Unified API
src/stores/shared/notificationStore.ts           # Unified store
src/hooks/shared/useNotifications.ts             # Unified hooks
```

## Migration Details

### 1. **Unified API Service**
- **Location**: `src/services/shared/notificationApi.ts`
- **Endpoints**: Uses `/notifications/my` for all user types
- **Backend**: Determines user type from auth token automatically

### 2. **Unified Store**
- **Location**: `src/stores/shared/notificationStore.ts`
- **Features**: Same functionality as before but works for both user types
- **Persistence**: Maintains unread count and filter preferences

### 3. **Unified Hooks**
- **Location**: `src/hooks/shared/useNotifications.ts`
- **Hooks Available**:
  - `useNotifications()` - Main notification management
  - `useUnreadNotificationCount()` - Lightweight unread count
  - `usePushNotificationRegistration()` - Push token management

### 4. **Backward Compatibility**
- Customer files re-export from shared location
- Restaurant files re-export from shared location
- Existing imports continue to work without changes

## Files Deleted

The following files have been removed as they're no longer needed:

- ❌ `src/stores/restaurantStores/notificationStore.ts`
- ❌ `src/services/restaurant/notificationApi.ts`

## Files Modified

### Re-export Files (Backward Compatibility)
- ✅ `src/stores/customerStores/notificationStore.ts` - Now re-exports shared store
- ✅ `src/services/customer/notification.service.ts` - Now re-exports shared API
- ✅ `src/hooks/restaurant/useNotifications.ts` - Now re-exports shared hooks

### Updated Files
- ✅ `src/stores/AuthStore.ts` - Clears shared notification store on logout
- ✅ `src/stores/restaurantStores/index.ts` - Re-exports shared notification store
- ✅ `src/stores/index.ts` - Includes shared stores

## Usage Examples

### For Customer Components
```typescript
// This continues to work exactly as before
import { useNotifications } from '@/src/stores/customerStores/notificationStore';

// Or use the new shared location
import { useNotifications } from '@/src/hooks/shared/useNotifications';
```

### For Restaurant Components
```typescript
// This continues to work exactly as before
import { useRestaurantNotifications } from '@/src/hooks/restaurant/useNotifications';

// Or use the new shared location
import { useNotifications } from '@/src/hooks/shared/useNotifications';
```

### New Unified Approach
```typescript
import { useNotifications } from '@/src/hooks/shared/useNotifications';

const MyComponent = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refresh,
    userType, // 'customer' or 'restaurant'
  } = useNotifications();

  // The hook automatically works for both user types
  // Backend returns appropriate notifications based on auth token
};
```

## Benefits

### 1. **Reduced Code Duplication**
- Single API service instead of two
- Single store instead of two
- Single set of hooks instead of two

### 2. **Simplified Maintenance**
- One place to fix bugs
- One place to add features
- Consistent behavior across user types

### 3. **Better Type Safety**
- Unified TypeScript interfaces
- Consistent error handling
- Shared validation logic

### 4. **Backward Compatibility**
- Existing code continues to work
- No breaking changes
- Gradual migration possible

## API Endpoints

### Unified Endpoints
All user types now use the same endpoints:

```
GET    /notifications/my              # Get notifications (paginated)
PATCH  /notifications/:id/read        # Mark notification as read
PATCH  /notifications/read-all        # Mark all as read
GET    /notifications/unread-count    # Get unread count
DELETE /notifications/:id             # Delete notification
POST   /notifications/register-token  # Register push token
DELETE /notifications/unregister-token # Unregister push token
```

### Backend Behavior
- Backend determines user type from JWT token
- Returns appropriate notifications for that user type
- Filters by user permissions automatically

## Testing

### What to Test
1. **Customer notifications** still work as before
2. **Restaurant notifications** still work as before
3. **Push notifications** work for both user types
4. **Unread counts** update correctly
5. **Mark as read** functionality works
6. **Logout** clears notification data

### Test Cases
```typescript
// Test customer notifications
const customerUser = { role: 'customer', id: 'customer-123' };
// Should receive customer-specific notifications

// Test restaurant notifications  
const restaurantUser = { role: 'restaurant', id: 'restaurant-456' };
// Should receive restaurant-specific notifications

// Test logout
// Should clear all notification data
```

## Troubleshooting

### Common Issues

1. **Import Errors**
   - **Problem**: Cannot find notification imports
   - **Solution**: Use shared location or existing re-exports

2. **Missing Notifications**
   - **Problem**: Notifications not loading
   - **Solution**: Check authentication and user type

3. **Push Notifications Not Working**
   - **Problem**: Push tokens not registering
   - **Solution**: Verify notification service initialization

### Debug Steps

1. Check user authentication status
2. Verify user type is set correctly
3. Check network requests to `/notifications/my`
4. Verify push token registration
5. Check console for deprecation warnings

## Future Improvements

1. **Real-time Updates**: WebSocket support for live notifications
2. **Offline Support**: Cache notifications for offline viewing
3. **Rich Notifications**: Support for images and actions
4. **Notification Categories**: Better filtering and organization
5. **Analytics**: Track notification engagement

## Migration Checklist

- ✅ Unified notification API created
- ✅ Unified notification store created
- ✅ Unified notification hooks created
- ✅ Backward compatibility maintained
- ✅ Restaurant-specific files removed
- ✅ Customer files updated to re-export
- ✅ AuthStore updated to clear shared store
- ✅ Store indexes updated
- ✅ Documentation created
- ✅ Migration guide written

The migration is complete and all existing functionality is preserved while providing a cleaner, more maintainable architecture.