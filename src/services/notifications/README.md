# Notification System

A simple, efficient notification system for the Food Rush app that handles both local notifications and push notifications from the backend.

## Features

- ✅ Local notifications (immediate and scheduled)
- ✅ Push notification registration with backend
- ✅ Prevents infinite loops and duplicate initializations
- ✅ Type-safe notification helpers
- ✅ React hooks for easy integration
- ✅ Context provider for app-wide access

## Quick Start

### 1. Using the Context (Recommended)

```tsx
import { useNotificationContext } from '@/src/contexts/SimpleNotificationProvider';

const MyComponent = () => {
  const { sendOrderStatus, scheduleCartReminder } = useNotificationContext();

  const handleOrderConfirmed = async () => {
    await sendOrderStatus('12345', 'confirmed', 'Pizza Palace');
  };

  const handleAddToCart = async () => {
    await scheduleCartReminder(3, 'Pizza Palace', 30); // 30 minutes
  };

  return (
    // Your component JSX
  );
};
```

### 2. Using the Hook Directly

```tsx
import { useNotifications } from '@/src/hooks/useNotifications';

const MyComponent = () => {
  const { sendOrderStatus, userType } = useNotifications();

  // Use notification functions...
};
```

### 3. Direct Service Usage

```tsx
import { 
  sendOrderStatusNotification,
  scheduleCartReminder,
  sendPromotionNotification 
} from '@/src/services/notifications/NotificationHelpers';

// Send immediate notification
await sendOrderStatusNotification('12345', 'confirmed', 'Pizza Palace');

// Schedule notification
await scheduleCartReminder(2, 'Burger King', 25);

// Send promotion
await sendPromotionNotification('Flash Sale!', 'Get 30% off!', 'promo_123');
```

## Available Functions

### Customer Functions
- `sendOrderStatus(orderId, status, restaurantName?)` - Order status updates
- `scheduleCartReminder(itemCount, restaurantName?, minutes?)` - Cart abandonment reminders
- `cancelCartReminders()` - Cancel all cart reminders

### Restaurant Functions
- `sendNewOrder(orderId, customerName?)` - New order notifications

### Common Functions
- `sendPromotion(title, message, promotionId?)` - Promotional notifications
- `sendGeneral(title, message, data?)` - General purpose notifications

## Notification Types

### Order Status Notifications
- `confirmed` - Order has been confirmed
- `preparing` - Order is being prepared
- `ready` - Order is ready for pickup
- `delivered` - Order has been delivered
- `cancelled` - Order has been cancelled

### Cart Reminders
Scheduled notifications to remind users about items in their cart.

### Promotions
Marketing notifications for special offers and promotions.

## Backend Integration

The system automatically registers push tokens with your backend when users authenticate. Make sure your backend has an endpoint at `/api/notifications/register-token` that accepts:

```json
{
  "token": "ExponentPushToken[...]",
  "userId": "user123",
  "userType": "customer",
  "platform": "ios"
}
```

## Testing

Use the `NotificationTest` component to test notifications in development:

```tsx
import NotificationTest from '@/src/components/common/NotificationTest';

// Add to your screen for testing
<NotificationTest />
```

## Architecture

```
NotificationService (Singleton)
├── Handles Expo notifications
├── Manages push token registration
└── Provides core notification functions

NotificationHelpers
├── High-level notification functions
├── Prevents duplicate initializations
└── Handles common use cases

useNotifications Hook
├── Integrates with auth state
├── Provides memoized functions
└── Prevents infinite loops

SimpleNotificationProvider
├── App-wide notification context
├── Optimized with useMemo
└── Easy component integration
```

## Error Handling

The system includes comprehensive error handling:
- Failed permission requests are logged but don't crash the app
- Backend registration failures are logged but don't prevent local notifications
- Duplicate initializations are prevented automatically
- All notification functions are wrapped in try-catch blocks

## Performance

- Uses singleton pattern to prevent multiple service instances
- Memoizes context values to prevent unnecessary re-renders
- Tracks initialized users to prevent duplicate setup
- Optimized Zustand selectors to prevent infinite loops