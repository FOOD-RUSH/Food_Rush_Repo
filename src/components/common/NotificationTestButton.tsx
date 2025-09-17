import React from 'react';
import { TouchableOpacity, Text, Alert } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useNotificationStore } from '@/src/stores/customerStores/notificationStore';
import { 
  createOrderNotification, 
  createDeliveryNotification, 
  createPromotionNotification,
  createSystemNotification 
} from '@/src/utils/notificationUtils';

interface NotificationTestButtonProps {
  style?: any;
}

/**
 * Test component for demonstrating notification functionality
 * This should be removed in production
 */
const NotificationTestButton: React.FC<NotificationTestButtonProps> = ({ style }) => {
  const { colors } = useTheme();
  const { addNotification } = useNotificationStore();

  const showTestOptions = () => {
    Alert.alert(
      'Test Notifications',
      'Choose a notification type to test:',
      [
        {
          text: 'Order Update',
          onPress: () => {
            const notification = createOrderNotification(
              'order_123',
              'confirmed',
              'Pizza Palace'
            );
            addNotification(notification);
          },
        },
        {
          text: 'Delivery Update',
          onPress: () => {
            const notification = createDeliveryNotification(
              'order_123',
              'Your order is on the way!',
              '15 minutes'
            );
            addNotification(notification);
          },
        },
        {
          text: 'Promotion',
          onPress: () => {
            const notification = createPromotionNotification(
              '50% Off Today!',
              'Get 50% off your next order at participating restaurants. Limited time offer!',
              'restaurant_456'
            );
            addNotification(notification);
          },
        },
        {
          text: 'System Alert',
          onPress: () => {
            const notification = createSystemNotification(
              'App Update Available',
              'A new version of FoodRush is available. Update now for the latest features and improvements.'
            );
            addNotification(notification);
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  // Only show in development mode
  if (__DEV__) {
    return (
      <TouchableOpacity
        onPress={showTestOptions}
        style={[
          {
            backgroundColor: colors.primary,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 8,
            margin: 8,
          },
          style,
        ]}
      >
        <Text style={{ color: colors.onPrimary, fontWeight: 'bold' }}>
          Test Notifications
        </Text>
      </TouchableOpacity>
    );
  }

  return null;
};

export default NotificationTestButton;