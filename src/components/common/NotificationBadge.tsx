import React from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from 'react-native-paper';

interface NotificationBadgeProps {
  count: number;
  maxCount?: number;
  size?: 'small' | 'medium' | 'large';
  color?: string;
  textColor?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  showZero?: boolean;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  offset?: { x: number; y: number };
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  maxCount = 99,
  size = 'medium',
  color,
  textColor,
  style,
  textStyle,
  showZero = false,
  position = 'top-right',
  offset = { x: 0, y: 0 },
}) => {
  const { colors } = useTheme();

  // Don't render if count is 0 and showZero is false
  if (count === 0 && !showZero) {
    return null;
  }

  // Get size dimensions
  const getSizeDimensions = () => {
    switch (size) {
      case 'small':
        return { width: 16, height: 16, fontSize: 10, minWidth: 16 };
      case 'large':
        return { width: 24, height: 24, fontSize: 12, minWidth: 24 };
      default: // medium
        return { width: 20, height: 20, fontSize: 11, minWidth: 20 };
    }
  };

  // Get position styles
  const getPositionStyles = (): ViewStyle => {
    const { width, height } = getSizeDimensions();
    const baseStyle: ViewStyle = {
      position: 'absolute',
      zIndex: 1,
    };

    switch (position) {
      case 'top-left':
        return {
          ...baseStyle,
          top: -height / 2 + offset.y,
          left: -width / 2 + offset.x,
        };
      case 'bottom-right':
        return {
          ...baseStyle,
          bottom: -height / 2 + offset.y,
          right: -width / 2 + offset.x,
        };
      case 'bottom-left':
        return {
          ...baseStyle,
          bottom: -height / 2 + offset.y,
          left: -width / 2 + offset.x,
        };
      default: // top-right
        return {
          ...baseStyle,
          top: -height / 2 + offset.y,
          right: -width / 2 + offset.x,
        };
    }
  };

  const dimensions = getSizeDimensions();
  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();
  const backgroundColor = color || colors.error;
  const foregroundColor = textColor || '#FFFFFF';

  return (
    <View
      style={[
        {
          backgroundColor,
          borderRadius: dimensions.height / 2,
          minWidth: dimensions.minWidth,
          height: dimensions.height,
          paddingHorizontal: count > 9 ? 4 : 0,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: '#FFFFFF',
        },
        getPositionStyles(),
        style,
      ]}
    >
      <Text
        style={[
          {
            color: foregroundColor,
            fontSize: dimensions.fontSize,
            fontWeight: 'bold',
            textAlign: 'center',
            includeFontPadding: false,
            textAlignVertical: 'center',
          },
          textStyle,
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {displayCount}
      </Text>
    </View>
  );
};

export default NotificationBadge;