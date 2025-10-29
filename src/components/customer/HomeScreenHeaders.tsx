import { View, Text } from 'react-native';
import React from 'react';
import { Button, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useResponsive } from '@/src/hooks/useResponsive';

interface HeaderProps {
  title: string;
  onPress: (() => void) | null;
}

const HomeScreenHeaders = ({ onPress, title }: HeaderProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');
  const { isSmallScreen, isTablet, scale, getResponsiveText } = useResponsive();

  // Responsive spacing
  const horizontalMargin = scale(8);
  const topMargin = scale(isSmallScreen ? 20 : isTablet ? 24 : 28);
  const bottomMargin = scale(8);

  return (
    <View
      className="flex-row justify-between items-center"
      style={{
        backgroundColor: colors.background,
        marginHorizontal: horizontalMargin,
        marginTop: topMargin,
        marginBottom: bottomMargin,
      }}
    >
      {/* Title */}
      <Text
        className="font-bold flex-1"
        style={{
          color: colors.onSurface,
          fontSize: getResponsiveText(isSmallScreen ? 18 : isTablet ? 20 : 22),
          lineHeight: getResponsiveText(
            isSmallScreen ? 24 : isTablet ? 26 : 28,
          ),
          minWidth: 0,
        }}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {title}
      </Text>

      {/* See More Button - Only show if onPress is provided */}
      {onPress && (
        <Button
          onPress={onPress}
          mode="text"
          compact={isSmallScreen}
          contentStyle={{
            paddingHorizontal: scale(isSmallScreen ? 4 : 8),
          }}
          labelStyle={{
            fontSize: getResponsiveText(isSmallScreen ? 13 : 14),
            color: colors.primary,
            fontWeight: '600',
          }}
        >
          {t('see_more')}
        </Button>
      )}
    </View>
  );
};

export default HomeScreenHeaders;
