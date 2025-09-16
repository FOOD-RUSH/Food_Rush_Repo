import React, { useCallback, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackScreenProps } from '@/src/navigation/types';
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
  const navigation = useNavigation<RootStackScreenProps<keyof any>['navigation']>();
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

      // Default navigation behavior - navigate to CategoryMenu screen
      navigation.navigate('CategoryMenu', {
        categoryTitle: title,
      });

      console.log('Navigating to category:', { title, categoryId });
    } catch (error) {
      console.error('Error navigating to category:', error);
      Alert.alert(t('navigation_error'), t('unable_to_open_category'), [
        { text: 'OK' },
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
          borderRadius: 12,
          margin: 6,
          padding: 12,
          backgroundColor: colors.surface,
          shadowColor: colors.shadow,
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.08,
          shadowRadius: 2,
          elevation: 3,
          width: 100,
          height: 90,
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
            height: 40,
            width: 40,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : imageError ? (
            <View
              style={{
                height: 40,
                width: 40,
                backgroundColor: colors.surfaceVariant,
                borderRadius: 20,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <MaterialIcons
                name="restaurant"
                size={20}
                color={colors.onSurfaceVariant}
              />
            </View>
          ) : (
            <Image
              source={image}
              style={{ height: 32, width: 32 }}
              resizeMode="contain"
              onError={handleImageError}
            />
          )}
        </View>

        {/* Category Title */}
        <Text
          style={{
            fontSize: 12,
            fontWeight: '600',
            color: colors.onSurface,
            textAlign: 'center',
          }}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {t(`category_${title.toLowerCase().replace(/[\s-]/g, '_')}`, title)}
        </Text>

        {/* Item Count */}
        {itemCount !== undefined && (
          <Text
            style={{
              fontSize: 10,
              color: colors.onSurfaceVariant,
              marginTop: 2,
              textAlign: 'center',
            }}
          >
            {itemCount} {t('items')}
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
              borderRadius: 12,
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
