import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useUnreadNotificationCount } from '@/src/hooks/customer/useNotifications';

interface NotificationBadgeProps {
  size?: 'small' | 'medium' | 'large';
  showZero?: boolean;
  maxCount?: number;
  style?: any;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  size = 'medium',
  showZero = false,
  maxCount = 99,
  style,
}) => {
  const { colors } = useTheme();
  const { unreadCount } = useUnreadNotificationCount();

  // Don't show badge if count is 0 and showZero is false
  if (unreadCount === 0 && !showZero) {
    return null;
  }

  // Get size styles
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: 'w-4 h-4',
          text: 'text-xs',
          fontSize: 10,
        };
      case 'large':
        return {
          container: 'w-7 h-7',
          text: 'text-sm',
          fontSize: 12,
        };
      default: // medium
        return {
          container: 'w-5 h-5',
          text: 'text-xs',
          fontSize: 11,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  // Format count display
  const displayCount = unreadCount > maxCount ? `${maxCount}+` : unreadCount.toString();

  return (
    <View
      className={`${sizeStyles.container} rounded-full items-center justify-center absolute -top-1 -right-1 z-10`}
      style={[
        {
          backgroundColor: colors.error,
          minWidth: size === 'small' ? 16 : size === 'large' ? 28 : 20,
        },
        style,
      ]}
    >
      <Text
        className={`${sizeStyles.text} font-bold text-center`}
        style={{
          color: colors.onError,
          fontSize: sizeStyles.fontSize,
          lineHeight: sizeStyles.fontSize + 2,
        }}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {displayCount}
      </Text>
    </View>
  );
};

export default NotificationBadge;