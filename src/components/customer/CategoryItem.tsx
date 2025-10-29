import React, { useCallback } from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '@/src/navigation/types';
import {  ActivityIndicator, useTheme } from 'react-native-paper';
import { useResponsive } from '@/src/hooks/useResponsive';

import { useTranslation } from 'react-i18next';
import {
  Caption,
  Overline,
} from '@/src/components/common/Typography';

interface CategoryItemProps {
  title: string;
  description?: string;
  categoryId?: string;
  isLoading?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  showBadge?: boolean;
  badgeText?: string;
  itemCount?: number;
  emoji: string;
  color: string;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  title,
  description,
  categoryId,
  isLoading = false,
  onPress,
  disabled = false,
  showBadge = false,
  badgeText,
  itemCount,
  emoji,
  color,
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { t } = useTranslation('translation');
  const { colors } = useTheme();
  const {  isTablet, isLargeScreen, getResponsiveText } = useResponsive();

  const handlePress = useCallback(() => {
    if (isLoading || disabled) return;

    try {
      // Custom onPress handler takes precedence
      if (onPress) {
        onPress();
        return;
      }

      // Default navigation behavior - navigate to CategoryMenu screen
      navigation.navigate('CategoryMenu', {
        categoryTitle: title,
      });
    } catch (error) {
      console.error('Error navigating to category:', error);
      Alert.alert(t('navigation_error'), t('unable_to_open_category'), [
        { text: 'OK' },
      ]);
    }
  }, [navigation, title, isLoading, disabled, onPress, t]);

  // Calculate responsive dimensions for category cards
  const getCategoryDimensions = () => {
    if (isLargeScreen) {
      return {
        cardSize: 100,
        emojiContainerSize: 50,
        emojiSize: 28,
        borderRadius: 16,
        padding: 12,
        titleFontSize: getResponsiveText(10),
        itemCountFontSize: getResponsiveText(8),
        badgeFontSize: getResponsiveText(9),
      };
    } else if (isTablet) {
      return {
        cardSize: 90,
        emojiContainerSize: 45,
        emojiSize: 26,
        borderRadius: 14,
        padding: 10,
        titleFontSize: getResponsiveText(9),
        itemCountFontSize: getResponsiveText(7),
        badgeFontSize: getResponsiveText(8),
      };
    } else {
      return {
        cardSize: 85,
        emojiContainerSize: 42,
        emojiSize: 24,
        borderRadius: 12,
        padding: 10,
        titleFontSize: getResponsiveText(9),
        itemCountFontSize: getResponsiveText(7),
        badgeFontSize: getResponsiveText(8),
      };
    }
  };

  const dimensions = getCategoryDimensions();

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={isLoading || disabled}
      activeOpacity={0.7}
      style={{
        opacity: isLoading || disabled ? 0.6 : 1,
      }}
    >
      <View
        style={{
          borderRadius: dimensions.borderRadius,
          margin: 4,
          padding: dimensions.padding,
          backgroundColor: colors.surfaceVariant,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
          width: dimensions.cardSize,
          height: dimensions.cardSize,
          position: 'relative',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Badge */}
        {showBadge && badgeText && (
          <View
            style={{
              position: 'absolute',
              top: 6,
              right: 6,
              backgroundColor: colors.surface,
              borderRadius: 8,
              paddingHorizontal: 4,
              paddingVertical: 2,
              zIndex: 1,
            }}
          >
            <Overline color={colors.primary} weight="bold" style={{ fontSize: dimensions.badgeFontSize }}>
              {badgeText}
            </Overline>
          </View>
        )}

        {/* Emoji or Loading */}
        <View
          style={{
            height: dimensions.emojiContainerSize,
            width: dimensions.emojiContainerSize,
            borderRadius: dimensions.emojiContainerSize / 2,
            backgroundColor: `${color}15`,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 6,
          }}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Caption
              style={{
                fontSize: dimensions.emojiSize,
                lineHeight: dimensions.emojiSize,
              }}
            >
              {emoji || '🍽️'}
            </Caption>
          )}
        </View>

        {/* Category Title */}
        <Caption
          color={colors.onSurfaceVariant}
          weight="bold"
          align="center"
          numberOfLines={2}
          ellipsizeMode="tail"
          style={{ fontSize: dimensions.titleFontSize, lineHeight: dimensions.titleFontSize * 1.2 }}
        >
          {t(
            `category_${title?.toLowerCase().replace(/[\s-]/g, '_') || 'unknown'}`,
            title || 'Unknown Category',
          )}
        </Caption>

        {/* Item Count */}
        {itemCount !== undefined && (
          <Overline
            color={colors.onSurfaceVariant}
            align="center"
            style={{ marginTop: 2, fontSize: dimensions.itemCountFontSize, opacity: 0.7 }}
          >
            {itemCount} {t('items')}
          </Overline>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: colors.surfaceVariant,
              borderRadius: dimensions.borderRadius,
              justifyContent: 'center',
              alignItems: 'center',
              opacity: 0.9,
            }}
          >
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default CategoryItem;
