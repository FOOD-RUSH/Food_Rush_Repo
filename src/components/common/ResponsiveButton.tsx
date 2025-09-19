import React from 'react';
import { ViewStyle, TextStyle } from 'react-native';
import { Button, ButtonProps, useTheme } from 'react-native-paper';
import { useResponsive, useResponsiveFontSize, useResponsiveSpacing } from '@/src/hooks/useResponsive';
import { getUrbanistFont } from '@/src/config/fonts';

interface ResponsiveButtonProps extends Omit<ButtonProps, 'labelStyle' | 'contentStyle'> {
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  fontWeight?: 'regular' | 'medium' | 'semibold' | 'bold';
  responsive?: boolean;
  labelStyle?: TextStyle | TextStyle[];
  contentStyle?: ViewStyle | ViewStyle[];
}

export const ResponsiveButton: React.FC<ResponsiveButtonProps> = ({
  size = 'medium',
  fullWidth = false,
  fontWeight = 'medium',
  responsive = true,
  labelStyle,
  contentStyle,
  children,
  ...props
}) => {
  const { colors } = useTheme();
  const { isSmallScreen, isTablet } = useResponsive();
  const fontSize = useResponsiveFontSize();
  const spacing = useResponsiveSpacing();

  // Size configurations
  const sizeConfig = {
    small: {
      fontSize: fontSize.sm,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
      borderRadius: 8,
    },
    medium: {
      fontSize: fontSize.base,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: 12,
    },
    large: {
      fontSize: fontSize.lg,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: 16,
    },
  };

  const config = sizeConfig[size];

  // Responsive adjustments
  const getResponsiveConfig = () => {
    if (!responsive) return config;

    const adjustmentFactor = isSmallScreen ? 0.9 : isTablet ? 1.1 : 1;
    
    return {
      fontSize: Math.round(config.fontSize * adjustmentFactor),
      paddingVertical: Math.round(config.paddingVertical * adjustmentFactor),
      paddingHorizontal: Math.round(config.paddingHorizontal * adjustmentFactor),
      borderRadius: Math.round(config.borderRadius * adjustmentFactor),
    };
  };

  const responsiveConfig = getResponsiveConfig();

  // Button content style
  const buttonContentStyle: ViewStyle = {
    paddingVertical: responsiveConfig.paddingVertical,
    paddingHorizontal: responsiveConfig.paddingHorizontal,
    ...(fullWidth && { width: '100%' }),
  };

  // Button label style
  const buttonLabelStyle: TextStyle = {
    fontSize: responsiveConfig.fontSize,
    fontFamily: getUrbanistFont(fontWeight),
    lineHeight: responsiveConfig.fontSize * 1.2,
  };

  // Combine styles
  const combinedContentStyle = Array.isArray(contentStyle)
    ? [buttonContentStyle, ...contentStyle]
    : [buttonContentStyle, contentStyle].filter(Boolean);

  const combinedLabelStyle = Array.isArray(labelStyle)
    ? [buttonLabelStyle, ...labelStyle]
    : [buttonLabelStyle, labelStyle].filter(Boolean);

  return (
    <Button
      contentStyle={combinedContentStyle}
      labelStyle={combinedLabelStyle}
      style={{
        borderRadius: responsiveConfig.borderRadius,
        ...(fullWidth && { width: '100%' }),
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

// Predefined button variants
export const SmallButton: React.FC<Omit<ResponsiveButtonProps, 'size'>> = (props) => (
  <ResponsiveButton size="small" {...props} />
);

export const MediumButton: React.FC<Omit<ResponsiveButtonProps, 'size'>> = (props) => (
  <ResponsiveButton size="medium" {...props} />
);

export const LargeButton: React.FC<Omit<ResponsiveButtonProps, 'size'>> = (props) => (
  <ResponsiveButton size="large" {...props} />
);

export const FullWidthButton: React.FC<Omit<ResponsiveButtonProps, 'fullWidth'>> = (props) => (
  <ResponsiveButton fullWidth {...props} />
);

export default ResponsiveButton;