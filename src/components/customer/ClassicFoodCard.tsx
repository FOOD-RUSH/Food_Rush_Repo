import { IoniconsIcon, MaterialIcon } from '@/src/components/common/icons';
import { TouchableOpacity, View, Text, Platform } from 'react-native';
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

  // Calculate responsive dimensions and text sizes like RestaurantCard
  const getCardDimensions = () => {
    if (isLargeScreen) {
      return {
        width: Math.min(wp(35), 240), // Increased max width
        imageSize: 130,
        padding: 16,
        borderRadius: 20,
        heartIconSize: 22,
        // Text sizes (increased by 2px)
        foodNameSize: getResponsiveText(19), // Increased by 2
        restaurantNameSize: getResponsiveText(17), // Increased by 2
        ratingSize: getResponsiveText(15), // Increased by 2
        distanceSize: getResponsiveText(15), // Increased by 2
        priceSize: getResponsiveText(18), // Increased by 2
        deliverySize: getResponsiveText(15), // Increased by 2
        badgeSize: getResponsiveText(12), // Increased by 2
      };
    } else if (isTablet) {
      return {
        width: Math.min(wp(40), 210), // Increased max width
        imageSize: 120,
        padding: 14,
        borderRadius: 18,
        heartIconSize: 20,
        // Text sizes (increased by 2px)
        foodNameSize: getResponsiveText(18), // Increased by 2
        restaurantNameSize: getResponsiveText(16), // Increased by 2
        ratingSize: getResponsiveText(14), // Increased by 2
        distanceSize: getResponsiveText(14), // Increased by 2
        priceSize: getResponsiveText(17), // Increased by 2
        deliverySize: getResponsiveText(14), // Increased by 2
        badgeSize: getResponsiveText(11), // Increased by 2
      };
    } else {
      return {
        width: Math.min(wp(50), 190), // Increased max width
        imageSize: 110,
        padding: 12,
        borderRadius: 16,
        heartIconSize: 18,
        // Text sizes (increased by 2px)
        foodNameSize: getResponsiveText(17), // Increased by 2
        restaurantNameSize: getResponsiveText(15), // Increased by 2
        ratingSize: getResponsiveText(13), // Increased by 2
        distanceSize: getResponsiveText(13), // Increased by 2
        priceSize: getResponsiveText(16), // Increased by 2
        deliverySize: getResponsiveText(13), // Increased by 2
        badgeSize: getResponsiveText(10), // Increased by 2
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
        style={{
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.outline + '30',
          borderRadius: cardDimensions.borderRadius,
          width: cardDimensions.width,
          alignSelf: 'center',
          overflow: 'hidden',
          // Enhanced shadow like RestaurantCard
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.12,
          shadowRadius: 6,
          elevation: 6,
          // Add opacity for unavailable items
          opacity: isAvailable ? 1 : 0.7,
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
              resizeMode="cover"
            />
            <TouchableOpacity 
              className="absolute top-2 right-2 bg-white rounded-full shadow-sm"
              style={{ 
                padding: cardDimensions.padding * 0.4,
                ...Platform.select({
                  ios: {
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                  },
                  android: {
                    elevation: 3,
                  },
                }),
              }}
            >
              <IoniconsIcon 
                name="heart-outline" 
                color={'#ff6b6b'} 
                size={cardDimensions.heartIconSize} 
              />
            </TouchableOpacity>

            {/* Status badge */}
            {(status || !isAvailable) && (
              <View
                className={`absolute top-2 left-2 rounded-md px-2 py-1 ${
                  !isAvailable ? 'bg-red-500' : 'bg-blue-500'
                }`}
              >
                <Text 
                  className="text-white font-bold text-center" 
                  style={{ fontSize: cardDimensions.badgeSize }}
                >
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
                fontSize: cardDimensions.foodNameSize,
                lineHeight: cardDimensions.foodNameSize * 1.2,
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
                fontSize: cardDimensions.restaurantNameSize,
                lineHeight: cardDimensions.restaurantNameSize * 1.2,
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
              <IoniconsIcon name="star" size={cardDimensions.ratingSize} color={'#ffbb00'} />
              <Text
                className="ml-1"
                style={{ 
                  color: colors.onSurface,
                  fontSize: cardDimensions.ratingSize
                }}
              >
                {rating ? rating.toFixed(1) : 'N/A'}
              </Text>
            </View>
            <View className="flex-row items-center">
              <IoniconsIcon
                name="location-outline"
                size={cardDimensions.distanceSize}
                color={colors.primary}
              />
              <Text
                className="ml-1"
                style={{ 
                  color: colors.onSurface,
                  fontSize: cardDimensions.distanceSize
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
                fontSize: cardDimensions.priceSize,
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
                size={cardDimensions.deliverySize}
              />
              <Text
                className="ml-1"
                style={{ 
                  color: colors.onSurface,
                  fontSize: cardDimensions.deliverySize
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