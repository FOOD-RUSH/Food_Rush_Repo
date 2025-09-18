# Notification System Documentation

## Overview

The FoodRush notification system is a complete MVP implementation that handles real-time notifications for the food delivery app. It supports multiple notification types, pagination, real-time updates, and provides a clean, production-ready interface.

## Features

### ✅ Core Features

- **Paginated Notification List** - Efficient loading with infinite scroll
- **Real-time Updates** - Instant notification delivery and status updates
- **Multiple Notification Types** - ORDER, DELIVERY, PROMOTION, SYSTEM
- **Mark as Read/Unread** - Individual and bulk read status management
- **Unread Count Badge** - Visual indicator in navigation
- **Pull-to-Refresh** - Manual refresh capability
- **Internationalization** - English and French translations
- **Responsive Design** - Works across all screen sizes
- **Error Handling** - Graceful error states and retry mechanisms

### 🎯 API Integration

- **GET /notifications/my** - Fetch notifications with pagination
- **PATCH /notifications/:id/read** - Mark specific notification as read
- **PATCH /notifications/read-all** - Mark all notifications as read
- **GET /notifications/unread-count** - Get unread notification count

## Architecture

### Components Structure

```
src/
├── components/
│   └── common/
│       ├── NotificationBadge.tsx          # Reusable badge component
│       └── NotificationTestButton.tsx     # Development testing component
├── contexts/
│   └── NotificationContext.tsx            # Context provider for real-time updates
├── hooks/
│   └── customer/
│       └── useNotifications.ts            # Custom hook for notification management
├── screens/
│   └── customer/
│       └── home/
│           └── NotificationScreen.tsx     # Main notification screen
├── services/
│   └── customer/
│       └── notification.service.ts       # API service layer
├── stores/
│   └── customerStores/
│       └── notificationStore.ts          # Zustand state management
├── types/
│   └── index.ts                          # TypeScript type definitions
└── utils/
    └── notificationUtils.ts              # Utility functions
```

## Usage

### Basic Implementation

```typescript
import { useNotifications } from '@/src/hooks/customer/useNotifications';

const MyComponent = () => {
  const {
    notifications,
    unreadCount,
    isLoading,
    refresh,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  return (
    <View>
      {/* Your notification UI */}
    </View>
  );
};
```

### Adding Notification Badge

```typescript
import NotificationBadge from '@/src/components/common/NotificationBadge';

const HeaderIcon = () => (
  <View style={{ position: 'relative' }}>
    <Icon name="notifications" />
    <NotificationBadge size="small" />
  </View>
);
```

### Creating Test Notifications

```typescript
import { createOrderNotification } from '@/src/utils/notificationUtils';
import { useNotificationStore } from '@/src/stores/customerStores/notificationStore';

const { addNotification } = useNotificationStore();

// Create and add a test notification
const testNotification = createOrderNotification(
  'order_123',
  'confirmed',
  'Pizza Palace',
);
addNotification(testNotification);
```

## API Response Format

### Notification List Response

```json
{
  "status_code": 200,
  "message": "Notifications Retrieved",
  "data": {
    "items": [
      {
        "id": "ntf_1",
        "title": "Order Confirmed",
        "body": "Your order has been confirmed by Pizza Palace",
        "type": "ORDER",
        "data": {
          "orderId": "order_123",
          "restaurantId": "rest_456"
        },
        "readAt": null,
        "createdAt": "2025-01-27T12:10:00Z"
      }
    ],
    "total": 1,
    "page": 1,
    "limit": 20,
    "pages": 1
  }
}
```

### Unread Count Response

```json
{
  "status_code": 200,
  "message": "Unread Count Retrieved",
  "data": 5
}
```

## Notification Types

### ORDER

- Order confirmation
- Order status updates
- Order completion
- Order cancellation

### DELIVERY

- Driver assigned
- Order picked up
- Delivery updates
- Delivery completion

### PROMOTION

- Special offers
- Discounts
- Restaurant promotions
- Seasonal deals

### SYSTEM

- App updates
- Maintenance notices
- Account notifications
- General announcements

## State Management

The notification system uses Zustand for state management with the following features:

- **Persistence** - Unread count persisted across app sessions
- **Optimistic Updates** - Immediate UI updates for better UX
- **Error Handling** - Comprehensive error states and recovery
- **Performance** - Optimized selectors to prevent unnecessary re-renders

### Store Structure

```typescript
interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasNextPage: boolean;
  currentPage: number;
  totalPages: number;
  total: number;
}
```

## Internationalization

The system supports multiple languages with comprehensive translations:

### English Keys

- `no_notifications` - "No Notifications"
- `mark_all_read` - "Mark All Read"
- `just_now` - "Just now"
- `hours_ago` - "{{count}}h ago"
- `days_ago` - "{{count}}d ago"

### French Keys

- `no_notifications` - "Aucune Notification"
- `mark_all_read` - "Tout Marquer comme Lu"
- `just_now` - "À l'instant"
- `hours_ago` - "Il y a {{count}}h"
- `days_ago` - "Il y a {{count}}j"

## Performance Optimizations

### 1. Pagination

- Loads 20 notifications per page by default
- Infinite scroll for seamless user experience
- Efficient memory management

### 2. Memoization

- React.memo for component optimization
- useMemo for expensive calculations
- useCallback for event handlers

### 3. Selective Updates

- Zustand selectors prevent unnecessary re-renders
- Optimistic updates for immediate feedback
- Background refresh without blocking UI

### 4. Error Boundaries

- Graceful error handling
- Retry mechanisms
- Fallback UI states

## Testing

### Development Testing

Use the `NotificationTestButton` component (only visible in development):

```typescript
import NotificationTestButton from '@/src/components/common/NotificationTestButton';

// Add to any screen for testing
<NotificationTestButton />
```

### Manual Testing Scenarios

1. **Empty State** - No notifications
2. **Loading State** - Initial load and pagination
3. **Error State** - Network errors and retry
4. **Mixed Content** - Different notification types
5. **Read/Unread** - Status management
6. **Real-time Updates** - New notifications

## Integration Guide

### 1. Navigation Setup

The notification screen is already integrated in `RootNavigator.tsx`:

```typescript
<Stack.Screen
  name="Notifications"
  component={NotificationScreen}
  options={{
    headerTitle: t('notifications'),
  }}
/>
```

### 2. Header Integration

The notification badge is integrated in `HomeHeader.tsx`:

```typescript
<TouchableOpacity onPress={handleNotificationPress}>
  <Ionicons name="notifications-outline" />
  {unreadCount > 0 && <Badge>{unreadCount}</Badge>}
</TouchableOpacity>
```

### 3. Context Provider

Add to your app's context hierarchy:

```typescript
<NotificationProvider>
  <YourAppContent />
</NotificationProvider>
```

## Security Considerations

### 1. Authentication

- All API calls include authentication headers
- Automatic token refresh handling
- Secure token storage

### 2. Data Validation

- TypeScript for compile-time safety
- Runtime validation for API responses
- Sanitized notification content

### 3. Privacy

- User-specific notifications only
- No sensitive data in notification content
- Secure data transmission

## Future Enhancements

### Planned Features

- [ ] Push notification integration
- [ ] Notification categories/filtering
- [ ] Notification scheduling
- [ ] Rich media notifications
- [ ] Notification templates
- [ ] Analytics and tracking

### Possible Improvements

- [ ] Offline notification queue
- [ ] Notification grouping
- [ ] Custom notification sounds
- [ ] Notification actions (quick reply, etc.)
- [ ] Advanced filtering options

## Troubleshooting

### Common Issues

1. **Notifications not loading**
   - Check network connection
   - Verify authentication status
   - Check API endpoint availability

2. **Unread count not updating**
   - Ensure user is authenticated
   - Check store state persistence
   - Verify API response format

3. **Performance issues**
   - Check pagination settings
   - Monitor memory usage
   - Optimize component re-renders

### Debug Tools

```typescript
// Enable debug logging
const store = useNotificationStore.getState();
console.log('Notification State:', store);

// Test API directly
import { notificationApi } from '@/src/services/customer/notification.service';
const response = await notificationApi.getNotifications({ limit: 10, page: 1 });
```

## Conclusion

The notification system is production-ready and provides a solid foundation for real-time user engagement. It follows React Native best practices, includes comprehensive error handling, and supports internationalization for global deployment.

For questions or contributions, please refer to the main project documentation or contact the development team.
