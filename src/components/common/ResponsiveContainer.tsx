import React from 'react';
import { View, ViewProps, ViewStyle } from 'react-native';
import { useResponsive, useResponsiveSpacing } from '@/src/hooks/useResponsive';

interface ResponsiveContainerProps extends ViewProps {
  children: React.ReactNode;
  maxWidth?: number;
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  margin?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  center?: boolean;
  fullWidth?: boolean;
  responsive?: boolean;
  breakpoint?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  maxWidth,
  padding = 'md',
  margin = 'none',
  center = false,
  fullWidth = true,
  responsive = true,
  breakpoint,
  style,
  ...props
}) => {
  const { screen, breakpoints, isSmallScreen, isTablet } = useResponsive();
  const spacing = useResponsiveSpacing();

  // Determine if container should be visible based on breakpoint
  const shouldShow = !breakpoint || breakpoints[breakpoint];

  if (!shouldShow) {
    return null;
  }

  // Calculate responsive padding
  const getPadding = () => {
    if (padding === 'none') return 0;
    return spacing[padding as keyof typeof spacing];
  };

  // Calculate responsive margin
  const getMargin = () => {
    if (margin === 'none') return 0;
    return spacing[margin as keyof typeof spacing];
  };

  // Calculate responsive max width
  const getMaxWidth = () => {
    if (!responsive) return maxWidth;

    if (maxWidth) {
      if (isSmallScreen) return Math.min(maxWidth, screen.width * 0.95);
      if (isTablet) return Math.min(maxWidth, screen.width * 0.9);
      return maxWidth;
    }

    // Default responsive max widths
    if (isSmallScreen) return screen.width * 0.95;
    if (isTablet) return screen.width * 0.85;
    return screen.width * 0.8;
  };

  const containerStyle: ViewStyle = {
    width: fullWidth ? '100%' : 'auto',
    maxWidth: getMaxWidth(),
    paddingHorizontal: getPadding(),
    paddingVertical: getPadding(),
    marginHorizontal: center ? 'auto' : getMargin(),
    marginVertical: getMargin(),
  };

  const combinedStyle = Array.isArray(style)
    ? [containerStyle, ...style]
    : [containerStyle, style].filter(Boolean);

  return (
    <View style={combinedStyle} {...props}>
      {children}
    </View>
  );
};

// Predefined responsive containers
export const ResponsiveRow: React.FC<ResponsiveContainerProps> = (props) => (
  <ResponsiveContainer
    {...props}
    style={[{ flexDirection: 'row' }, props.style]}
  />
);

export const ResponsiveColumn: React.FC<ResponsiveContainerProps> = (props) => (
  <ResponsiveContainer
    {...props}
    style={[{ flexDirection: 'column' }, props.style]}
  />
);

export const ResponsiveGrid: React.FC<
  ResponsiveContainerProps & {
    columns?: number;
    gap?: number;
  }
> = ({ columns = 2, gap = 16, children, ...props }) => {
  const { isSmallScreen, isTablet } = useResponsive();

  // Responsive column count
  const getColumns = () => {
    if (isSmallScreen) return Math.min(columns, 1);
    if (isTablet) return Math.min(columns, 2);
    return columns;
  };

  const gridStyle: ViewStyle = {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -gap / 2,
  };

  const itemStyle: ViewStyle = {
    width: `${100 / getColumns()}%`,
    paddingHorizontal: gap / 2,
    marginBottom: gap,
  };

  return (
    <ResponsiveContainer {...props} style={[gridStyle, props.style]}>
      {React.Children.map(children, (child, index) => (
        <View key={index} style={itemStyle}>
          {child}
        </View>
      ))}
    </ResponsiveContainer>
  );
};

export default ResponsiveContainer;
