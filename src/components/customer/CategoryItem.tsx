import React, { useCallback, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CustomerHomeStackScreenProps } from '@/src/navigation/types';
import { useTheme, ActivityIndicator } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

interface CategoryItemProps {
  title: string;
  image: any;
  categoryId?: string;
  isLoading?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  showBadge?: boolean;
  badgeText?: string;
  itemCount?: number;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  title,
  image,
  categoryId,
  isLoading = false,
  onPress,
  disabled = false,
  showBadge = false,
  badgeText,
  itemCount,
}) => {
  const navigation =
    useNavigation<CustomerHomeStackScreenProps<'HomeScreen'>['navigation']>();
  const { colors } = useTheme();
  const { t } = useTranslation('translation');
  const [imageError, setImageError] = useState(false);

  const handlePress = useCallback(() => {
    if (isLoading || disabled) return;

    try {
      // Custom onPress handler takes precedence
      if (onPress) {
        onPress();
        return;
      }

      // Default navigation behavior - navigate to SearchScreen with category filter
      navigation.navigate('SearchScreen', {
        type: 'category',
        category: title,
        categoryId: categoryId || title.toLowerCase().replace(/\s+/g, '-'),
      });

      console.log('Navigating to category:', { title, categoryId });
    } catch (error) {
      console.error('Error navigating to category:', error);
      Alert.alert(t('navigation_error'), t('unable_to_open_category'), [
        { text: 'OK'},
      ]);
    }
  }, [navigation, title, categoryId, isLoading, disabled, onPress, t]);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

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
          borderRadius: 16,
          margin: 8,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 16,
          backgroundColor: colors.surface,
          shadowColor: colors.shadow,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3.84,
          elevation: 5,
          minHeight: 100,
          minWidth: 90,
          position: 'relative',
        }}
      >
        {/* Badge */}
        {showBadge && badgeText && (
          <View
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: colors.primary,
              borderRadius: 10,
              paddingHorizontal: 6,
              paddingVertical: 2,
              zIndex: 1,
            }}
          >
            <Text
              style={{
                color: 'white',
                fontSize: 10,
                fontWeight: 'bold',
              }}
            >
              {badgeText}
            </Text>
          </View>
        )}

        {/* Image or Loading */}
        <View
          style={{
            height: 56,
            width: 56,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : imageError ? (
            <View
              style={{
                height: 56,
                width: 56,
                backgroundColor: colors.surfaceVariant,
                borderRadius: 28,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <MaterialIcons
                name="restaurant"
                size={28}
                color={colors.onSurfaceVariant}
              />
            </View>
          ) : (
            <Image
              source={image}
              style={{ height: 40, width: 40 }}
              resizeMode="contain"
              onError={handleImageError}
            />
          )}
        </View>

        {/* Category Title */}
        <Text
          style={{
            fontSize: 14,
            fontWeight: '600',
            textAlign: 'center',
            color: colors.onSurface,
            maxWidth: 90,
            lineHeight: 18,
          }}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {title}
        </Text>

        {/* Item Count */}
        {itemCount !== undefined && (
          <Text
            style={{
              fontSize: 12,
              color: colors.onSurfaceVariant,
              marginTop: 4,
              textAlign: 'center',
            }}
          >
            {itemCount}
            {t('item')}
            {itemCount !== 1 ? t('items_suffix') : ''}
          </Text>
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
              backgroundColor: colors.surface,
              opacity: 0.8,
              borderRadius: 16,
              justifyContent: 'center',
              alignItems: 'center',
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
