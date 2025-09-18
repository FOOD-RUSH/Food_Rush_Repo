import React from 'react';
import { View, ViewStyle } from 'react-native';
import {
  useBreakpoint,
  getContainerMaxWidth,
  getResponsivePadding,
  Breakpoint,
} from '@/src/utils/responsive';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  maxWidth?: Breakpoint;
  padding?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  style?: ViewStyle;
  center?: boolean;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  maxWidth = 'lg',
  padding = 'md',
  className = '',
  style,
  center = true,
}) => {
  const breakpoint = useBreakpoint();
  const containerMaxWidth = getContainerMaxWidth(maxWidth);
  const containerPadding = getResponsivePadding(padding, breakpoint);

  const containerStyle: ViewStyle = {
    maxWidth: containerMaxWidth,
    paddingHorizontal: containerPadding,
    width: '100%',
    ...(center && { alignSelf: 'center' }),
    ...style,
  };

  return (
    <View style={containerStyle} className={className}>
      {children}
    </View>
  );
};

interface ResponsiveCardProps {
  children: React.ReactNode;
  padding?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  margin?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  style?: ViewStyle;
}

export const ResponsiveCard: React.FC<ResponsiveCardProps> = ({
  children,
  padding = 'md',
  margin = 'sm',
  className = '',
  style,
}) => {
  const breakpoint = useBreakpoint();
  const cardPadding = getResponsivePadding(padding, breakpoint);
  const cardMargin = getResponsivePadding(margin, breakpoint);

  const cardStyle: ViewStyle = {
    padding: cardPadding,
    margin: cardMargin,
    borderRadius: 12,
    ...style,
  };

  return (
    <View style={cardStyle} className={`bg-white shadow-sm ${className}`}>
      {children}
    </View>
  );
};

interface ResponsiveGridProps {
  children: React.ReactNode;
  columns?: Partial<Record<Breakpoint, number>>;
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  columns = { xs: 1, sm: 2, md: 3, lg: 4, xl: 5 },
  spacing = 'md',
  className = '',
}) => {
  const breakpoint = useBreakpoint();
  const columnCount = columns[breakpoint] || columns.xs || 1;
  const gridSpacing = getResponsivePadding(spacing, breakpoint);

  const childrenArray = React.Children.toArray(children);

  return (
    <View
      className={className}
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        margin: -gridSpacing / 2,
      }}
    >
      {childrenArray.map((child, index) => (
        <View
          key={index}
          style={{
            width: `${100 / columnCount}%`,
            padding: gridSpacing / 2,
          }}
        >
          {child}
        </View>
      ))}
    </View>
  );
};
