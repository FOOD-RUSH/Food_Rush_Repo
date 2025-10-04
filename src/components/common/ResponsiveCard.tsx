import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { Card as PaperCard, CardProps, useTheme } from 'react-native-paper';
import { useResponsive } from '@/src/hooks/useResponsive';

interface ResponsiveCardProps extends CardProps {
  radius?: 'small' | 'medium' | 'large' | 'full';
  elevation?: number;
  children: React.ReactNode;
  style?: ViewStyle;
}

const ResponsiveCard: React.FC<ResponsiveCardProps> = ({
  radius = 'medium',
  elevation = 2,
  children,
  style,
  ...props
}) => {
  const { colors } = useTheme();
  const { scale } = useResponsive();

  // Define responsive border radius values
  const borderRadius = {
    small: scale(8),
    medium: scale(16),
    large: scale(24),
    full: scale(32),
  }[radius];

  // Define responsive elevation values
  const cardElevation = elevation;

  return (
    <PaperCard
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderRadius,
          elevation: cardElevation,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: StyleSheet.hairlineWidth * cardElevation,
          },
          shadowOpacity: 0.1,
          shadowRadius: scale(cardElevation),
          overflow: 'hidden',
        },
        style,
      ]}
      {...props}
    >
      {children}
    </PaperCard>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 0, // Remove default border if any
  },
});

export default ResponsiveCard;
