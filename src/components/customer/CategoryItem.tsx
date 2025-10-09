import { MaterialIcon } from '@/src/components/common/icons';
import React, { useCallback, useState } from 'react';
import { View, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '@/src/navigation/types';
import {  ActivityIndicator } from 'react-native-paper';
import { useResponsive } from '@/src/hooks/useResponsive';

import { useTranslation } from 'react-i18next';
import {
  Caption,
  Overline,
} from '@/src/components/common/Typography';

interface CategoryItemProps {
  title: string;
  image: any;
  description?: string;
  categoryId?: string;
  isLoading?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  showBadge?: boolean;
  badgeText?: string;
  itemCount?: number;
  emoji?: string;
  color?: string;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  title,
  image,
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
  const [imageError, setImageError] = useState(false);
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

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  // Calculate responsive dimensions for category cards
  const getCategoryDimensions = () => {
    if (isLargeScreen) {
      return {
        cardSize: 140, // Increased from 85 to 140
        imageContainerSize: 80, // Increased from 70 to 80
        imageSize: 60, // Increased from 50 to 60
        iconSize: 40, // Increased from 35 to 40
        borderRadius: 24, // Increased from 16 to 24
        padding: 18, // Increased from 12 to 18
        titleFontSize: getResponsiveText(11), // Decreased from 14 to 11
        itemCountFontSize: getResponsiveText(9), // Decreased from 11 to 9
        badgeFontSize: getResponsiveText(10), // Decreased from 12 to 10
      };
    } else if (isTablet) {
      return {
        cardSize: 120, // Increased from 85 to 120
        imageContainerSize: 70, // Increased from 60 to 70
        imageSize: 52, // Increased from 42 to 52
        iconSize: 32, // Increased from 28 to 32
        borderRadius: 20, // Increased from 16 to 20
        padding: 16, // Increased from 12 to 16
        titleFontSize: getResponsiveText(10), // Decreased from 13 to 10
        itemCountFontSize: getResponsiveText(8), // Decreased from 10 to 8
        badgeFontSize: getResponsiveText(9), // Decreased from 11 to 9
      };
    } else {
      return {
        cardSize: 150, // Increased from 85 to 100
        imageContainerSize: 100, // Increased from 50 to 60
        imageSize: 100, // Increased from 36 to 45
        iconSize: 28, // Increased from 22 to 28
        borderRadius: 18, // Increased from 16 to 18
        padding: 14, // Increased from 12 to 14
        titleFontSize: getResponsiveText(9), // Decreased from 12 to 9
        itemCountFontSize: getResponsiveText(7), // Decreased from 9 to 7
        badgeFontSize: getResponsiveText(8), // Decreased from 10 to 8
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
          backgroundColor: color || '#4A90E2', // Use custom color or default blue
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 3, // Increased shadow
          },
          shadowOpacity: 0.15, // Increased shadow opacity
          shadowRadius: 6, // Increased shadow radius
          elevation: 6, // Increased elevation for Android
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
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: 8,
              paddingHorizontal: 4,
              paddingVertical: 2,
              zIndex: 1,
            }}
          >
            <Overline color="#4A90E2" weight="bold" style={{ fontSize: dimensions.badgeFontSize }}>
              {badgeText}
            </Overline>
          </View>
        )}

        {/* Image or Loading */}
        <View
          style={{
            height: dimensions.imageContainerSize,
            width: dimensions.imageContainerSize,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: dimensions.imageContainerSize / 2,
          }}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : imageError ? (
            <View
              style={{
                height: dimensions.imageSize,
                width: dimensions.imageSize,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: dimensions.imageSize / 2,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <MaterialIcon
                name="restaurant"
                size={dimensions.iconSize}
                color="white"
              />
            </View>
          ) : (
            <Image
              source={image}
              style={{ height: dimensions.imageSize, width: dimensions.imageSize, tintColor: 'white' }}
              resizeMode="contain"
              onError={handleImageError}
            />
          )}
        </View>

        {/* Category Title */}
        <Caption
          color="white"
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
            color="rgba(255, 255, 255, 0.7)"
            align="center"
            style={{ marginTop: 2, fontSize: dimensions.itemCountFontSize }}
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
              backgroundColor: 'rgba(74, 144, 226, 0.8)',
              borderRadius: dimensions.borderRadius,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ActivityIndicator size="small" color="white" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default CategoryItem;
