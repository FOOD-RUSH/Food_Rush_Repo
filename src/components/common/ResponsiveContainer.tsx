import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { useResponsive } from '@/src/hooks/useResponsive';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  maxWidth?: number;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  centerContent?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  style,
  maxWidth,
  padding = 'md',
  centerContent = false,
  fullWidth = false,
  className,
}) => {
  const { getContainerWidth, getResponsiveSpacing } = useResponsive();

  const containerWidth = fullWidth ? '100%' : getContainerWidth(maxWidth);

  const paddingValue = padding === 'none' ? 0 :
                      padding === 'sm' ? getResponsiveSpacing(8) :
                      padding === 'md' ? getResponsiveSpacing(16) :
                      padding === 'lg' ? getResponsiveSpacing(24) :
                      getResponsiveSpacing(32);

  const containerStyle: ViewStyle = {
    width: containerWidth,
    paddingHorizontal: paddingValue,
    alignSelf: centerContent ? 'center' : 'stretch',
  };

  return (
    <View
      style={[containerStyle, style]}
      className={className}
    >
      {children}
    </View>
  );
};

// Specialized container variants
export const ResponsiveCard: React.FC<ResponsiveContainerProps & {
  mode?: 'elevated' | 'outlined' | 'contained';
  borderRadius?: number;
}> = ({
  children,
  mode = 'elevated',
  borderRadius = 12,
  ...props
}) => {
  const { colors } = { colors: { surface: '#ffffff', outline: '#e2e8f0' } }; // Fallback colors

  const cardStyle: ViewStyle = {
    backgroundColor: colors.surface,
    borderRadius,
    ...(mode === 'outlined' && {
      borderWidth: 1,
      borderColor: colors.outline,
    }),
    ...(mode === 'elevated' && {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    }),
  };

  return (
    <ResponsiveContainer {...props} style={[cardStyle, props.style]}>
      {children}
    </ResponsiveContainer>
  );
};

export const ResponsiveGrid: React.FC<ResponsiveContainerProps & {
  columns?: number;
  spacing?: number;
}> = ({
  children,
  columns = 2,
  spacing = 16,
  ...props
}) => {
  const { getGridColumns, getResponsiveSpacing } = useResponsive();

  const responsiveColumns = getGridColumns(columns);
  const responsiveSpacing = getResponsiveSpacing(spacing);

  const gridStyle: ViewStyle = {
    flexDirection: 'row',
    flexWrap: 'wrap',
  };

  // Convert children to array and add spacing
  const childrenArray = React.Children.toArray(children);
  const spacedChildren = childrenArray.map((child, index) => {
    const isLastInRow = (index + 1) % responsiveColumns === 0;
    const itemStyle: ViewStyle = {
      width: `${100 / responsiveColumns}%`,
      marginRight: isLastInRow ? 0 : responsiveSpacing,
      marginBottom: responsiveSpacing,
    };

    return (
      <View key={index} style={itemStyle}>
        {child}
      </View>
    );
  });

  return (
    <ResponsiveContainer {...props} style={[gridStyle, props.style]}>
      {spacedChildren}
    </ResponsiveContainer>
  );
};