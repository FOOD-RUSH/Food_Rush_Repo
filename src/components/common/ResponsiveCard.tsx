import React from 'react';
import {
  View,
  ViewStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { Card, CardProps, useTheme } from 'react-native-paper';
import { useResponsive, useResponsiveSpacing } from '@/src/hooks/useResponsive';

interface ResponsiveCardProps extends Omit<CardProps, 'style'> {
  children: React.ReactNode;
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  margin?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  elevation?: number;
  borderRadius?: number;
  onPress?: TouchableOpacityProps['onPress'];
  style?: ViewStyle | ViewStyle[];
  contentStyle?: ViewStyle | ViewStyle[];
  responsive?: boolean;
}

export const ResponsiveCard: React.FC<ResponsiveCardProps> = ({
  children,
  padding = 'md',
  margin = 'sm',
  elevation,
  borderRadius,
  onPress,
  style,
  contentStyle,
  responsive = true,
  ...props
}) => {
  const { colors } = useTheme();
  const { isSmallScreen, isTablet } = useResponsive();
  const spacing = useResponsiveSpacing();

  // Calculate responsive values
  const getElevation = () => {
    if (elevation !== undefined) return elevation;
    if (isSmallScreen) return 2;
    if (isTablet) return 4;
    return 3;
  };

  const getBorderRadius = () => {
    if (borderRadius !== undefined) return borderRadius;
    if (isSmallScreen) return 12;
    if (isTablet) return 16;
    return 14;
  };

  const getPadding = () => {
    if (padding === 'none') return 0;
    return spacing[padding as keyof typeof spacing];
  };

  const getMargin = () => {
    if (margin === 'none') return 0;
    return spacing[margin as keyof typeof spacing];
  };

  const cardStyle: ViewStyle = {
    margin: getMargin(),
    borderRadius: getBorderRadius(),
    backgroundColor: colors.surface,
    ...(responsive && {
      elevation: getElevation(),
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: getElevation() / 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: getElevation(),
    }),
  };

  const innerContentStyle: ViewStyle = {
    padding: getPadding(),
  };

  const combinedStyle = Array.isArray(style)
    ? [cardStyle, ...style]
    : [cardStyle, style].filter(Boolean);

  const combinedContentStyle = Array.isArray(contentStyle)
    ? [innerContentStyle, ...contentStyle]
    : [innerContentStyle, contentStyle].filter(Boolean);

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <Card style={combinedStyle} {...props}>
          <View style={combinedContentStyle}>{children}</View>
        </Card>
      </TouchableOpacity>
    );
  }

  return (
    <Card style={combinedStyle} {...props}>
      <View style={combinedContentStyle}>{children}</View>
    </Card>
  );
};

export default ResponsiveCard;
