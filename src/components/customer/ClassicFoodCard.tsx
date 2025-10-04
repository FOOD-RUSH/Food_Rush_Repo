import { IoniconsIcon, MaterialIcon } from '@/src/components/common/icons';
import { TouchableOpacity, View, Text } from 'react-native';
import React from 'react';
import { Card, useTheme } from 'react-native-paper';
import { useResponsive } from '@/src/hooks/useResponsive';
import { images } from '@/assets/images';
import { CustomerHomeStackScreenProps } from '@/src/navigation/types';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

interface ClassicFoodCardProps {
  id: string;
  restaurantId?: string;
  foodName?: string;
  foodPrice?: number | string;
  restaurantName?: string;
  distance?: number;
  rating?: number;
  status?: string;
  imageUrl?: string;
  deliveryStatus?: string;
  deliveryFee?: number;
  isAvailable?: boolean;
}

const ClassicFoodCard = ({
  id,
  restaurantId,
  foodName,
  foodPrice,
  restaurantName,
  distance,
  rating,
  status,
  imageUrl,
  deliveryStatus,
  deliveryFee,
  isAvailable = true,
}: ClassicFoodCardProps) => {
  const navigation =
    useNavigation<CustomerHomeStackScreenProps<'HomeScreen'>['navigation']>();
  const { colors } = useTheme();
  const { t } = useTranslation('translation');
  const { isSmallScreen, isTablet, isLargeScreen, wp, getResponsiveText } =
    useResponsive();

  // Calculate responsive dimensions
  const getCardDimensions = () => {
    if (isLargeScreen) {
      return {
        width: Math.min(wp(35), 220),
        imageSize: 120,
        padding: 16,
      };
    } else if (isTablet) {
      return {
        width: Math.min(wp(40), 200),
        imageSize: 110,
        padding: 14,
      };
    } else {
      return {
        width: Math.min(wp(50), 180),
        imageSize: 100,
        padding: 12,
      };
    }
  };

  const cardDimensions = getCardDimensions();

  // Helper function to get image source
  const getImageSource = () => {
    if (imageUrl) {
      const baseUrl = 'https://your-api-base-url.com';
      return {
        uri: imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`,
      };
    }
    return images.onboarding2;
  };

  const formatPrice = () => {
    if (!foodPrice) return 'N/A';
    const price = typeof foodPrice === 'string' ? parseFloat(foodPrice) : foodPrice;
    return isNaN(price) ? 'N/A' : `${price.toLocaleString()} XAF`;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        navigation.navigate('FoodDetails', {
          foodId: id,
        });
      }}
      className="my-2 mx-1"
    >
      <Card
        mode="outlined"
        className="overflow-hidden rounded-2xl"
        style={{
          width: cardDimensions.width,
          backgroundColor: colors.surface,
          borderColor: colors.outline + '30',
          borderWidth: 0.5,
          elevation: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}
      >
        <View style={{ padding: cardDimensions.padding }}>
          {/* Image with heart icon overlay */}
          <View className="relative mb-3">
            <Card.Cover
              source={getImageSource()}
              style={{
                height: cardDimensions.imageSize,
                width: cardDimensions.imageSize,
                borderRadius: cardDimensions.imageSize / 2,
                alignSelf: 'center',
              }}
            />
            <TouchableOpacity 
              className="absolute top-2 right-2 bg-white rounded-full shadow-sm"
              style={{ padding: 6 }}
            >
              <IoniconsIcon name="heart-outline" color={'#ff6b6b'} size={20} />
            </TouchableOpacity>

            {/* Status badge */}
            {(status || !isAvailable) && (
              <View
                className={`absolute top-2 left-2 rounded-md px-2 py-1 ${
                  !isAvailable ? 'bg-red-500' : 'bg-blue-500'
                }`}
              >
                <Text className="text-white font-bold text-center" style={{ fontSize: 10 }}>
                  {!isAvailable ? t('sold_out') : status || 'AVAILABLE'}
                </Text>
              </View>
            )}
          </View>

          {/* Food info */}
          <View className="mb-2 items-center w-full">
            <Text
              className="font-semibold mb-1 text-center w-full"
              style={{
                color: colors.onSurface,
                fontSize: getResponsiveText(isSmallScreen ? 14 : 16),
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {foodName || 'N/A'}
            </Text>
            <Text
              className="mb-2 text-center w-full"
              style={{
                color: colors.onSurfaceVariant,
                fontSize: getResponsiveText(isSmallScreen ? 12 : 14),
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {restaurantName || 'N/A'}
            </Text>
          </View>

          {/* Rating and distance */}
          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-row items-center">
              <IoniconsIcon name="star" size={16} color={'#ffbb00'} />
              <Text
                className="ml-1"
                style={{ 
                  color: colors.onSurface,
                  fontSize: getResponsiveText(12)
                }}
              >
                {rating ? rating.toFixed(1) : 'N/A'}
              </Text>
            </View>
            <View className="flex-row items-center">
              <IoniconsIcon
                name="location-outline"
                size={16}
                color={colors.primary}
              />
              <Text
                className="ml-1"
                style={{ 
                  color: colors.onSurface,
                  fontSize: getResponsiveText(12)
                }}
              >
                {distance ? `${distance.toFixed(1)}km` : 'N/A'}
              </Text>
            </View>
          </View>

          {/* Price and delivery info */}
          <View className="flex-row justify-between items-center">
            <Text
              className="font-bold flex-shrink"
              style={{ 
                color: colors.primary,
                fontSize: getResponsiveText(isSmallScreen ? 14 : 16),
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {formatPrice()}
            </Text>
            <View className="flex-row items-center flex-shrink-0">
              <MaterialIcon
                name="delivery-dining"
                color={colors.primary}
                size={18}
              />
              <Text
                className="ml-1"
                style={{ 
                  color: colors.onSurface,
                  fontSize: getResponsiveText(12)
                }}
                numberOfLines={1}
              >
                {deliveryFee ? `${deliveryFee} XAF` : 'N/A'}
              </Text>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default ClassicFoodCard;