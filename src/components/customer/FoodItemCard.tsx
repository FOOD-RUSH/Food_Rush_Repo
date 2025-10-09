import { IoniconsIcon } from '@/src/components/common/icons';
import { CustomerHomeStackScreenProps } from '@/src/navigation/types';

import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useResponsive } from '@/src/hooks/useResponsive';
import { images } from '@/assets/images';

const { width: screenWidth } = Dimensions.get('window');

export interface FoodItemCardProps {
  foodId: string;
  restaurantId: string;
  FoodName?: string;
  FoodPrice: string | number; // Accept both string and number
  FoodImage: any;
  RestaurantName: string;
  distanceFromUser?: number;
  DeliveryPrice?: number;
  hasPromo?: boolean;
  onLike?: () => void;
  loved?: boolean;
  // Additional props from API
  distanceKm?: number;
  isAvailable?: boolean;
  deliveryFee?: number | null;
  pictureUrl?: string | null;
}

const FoodItemCard = ({
  foodId,
  restaurantId,
  FoodName,
  FoodPrice,
  FoodImage,
  RestaurantName,
  distanceFromUser = 0,
  DeliveryPrice = 0,
  hasPromo = false,
  onLike,
  loved = false,
  distanceKm,
  isAvailable = true,
  deliveryFee,
  pictureUrl,
}: FoodItemCardProps) => {
  const navigation =
    useNavigation<CustomerHomeStackScreenProps<'HomeScreen'>['navigation']>();
  const { colors } = useTheme();
  const { t } = useTranslation('translation');
  const {
    isSmallScreen,
    isTablet,
    isLargeScreen,
    wp,
    scale,
    getResponsiveText,
  } = useResponsive();

  // Calculate responsive dimensions and text sizes with increased image and card sizes
  const getCardDimensions = () => {
    if (isLargeScreen) {
      return {
        width: Math.min(wp(50), 400), // Increased max width from 400px to 480px
        height: 175, // Increased height from 160 to 200
        imageSize: 120, // Increased image size from 100 to 140
        padding: 16, // Increased padding
        borderRadius: 22, // Increased border radius
        // Text sizes (increased by 2px)
        foodNameSize: getResponsiveText(17), // Increased by 2
        priceSize: getResponsiveText(16), // Increased by 2
        distanceSize: getResponsiveText(12), // Increased by 2
        deliverySize: getResponsiveText(11), // Increased by 2
        badgeSize: getResponsiveText(10), // Increased by 2
      };
    } else if (isTablet) {
      return {
        width: Math.min(wp(52), 360), // Increased max width from 340px to 420px
        height: 180, // Increased height from 150 to 180
        imageSize: 120, // Increased image size from 95 to 125
        padding: 12, // Increased padding
        borderRadius: 26, // Increased border radius
        // Text sizes (increased by 2px)
        foodNameSize: getResponsiveText(17), // Increased by 2
        priceSize: getResponsiveText(16), // Increased by 2
        distanceSize: getResponsiveText(12), // Increased by 2
        deliverySize: getResponsiveText(11), // Increased by 2
        badgeSize: getResponsiveText(10), // Increased by 2
      };
    } else {
      return {
        width: Math.min(wp(90), 350), // Increased max width from 300px to 350px
        height: 160, // Increased height from 140 to 160
        imageSize: 110, // Increased image size from 85 to 110
        padding: 14, // Increased padding
        borderRadius: 18, // Increased border radius
        // Text sizes (increased by 2px)
        foodNameSize: getResponsiveText(17), // Increased by 2
        priceSize: getResponsiveText(16), // Increased by 2
        distanceSize: getResponsiveText(12), // Increased by 2
        deliverySize: getResponsiveText(11), // Increased by 2
        badgeSize: getResponsiveText(10), // Increased by 2
      };
    }
  };

  const cardDimensions = getCardDimensions();

  const primaryColor = colors.primary;

  // Helper functions to handle data
  const getImageSource = () => {
    if (pictureUrl) {
      // Handle backend image URL
      const baseUrl = 'https://your-api-base-url.com'; // Replace with actual API base URL
      return {
        uri: pictureUrl.startsWith('http')
          ? pictureUrl
          : `${baseUrl}${pictureUrl}`,
      };
    }
    if (FoodImage) {
      return FoodImage;
    }
    return images.onboarding2;
  };

  const getFormattedPrice = () => {
    const price =
      typeof FoodPrice === 'string' ? parseFloat(FoodPrice) : FoodPrice;
    return isNaN(price) ? 'N/A' : price.toLocaleString();
  };

  const getDeliveryFee = () => {
    if (deliveryFee !== null && deliveryFee !== undefined) {
      return deliveryFee;
    }
    return DeliveryPrice || 0;
  };

  const getDistance = () => {
    if (distanceKm !== null && distanceKm !== undefined) {
      return distanceKm;
    }
    return distanceFromUser || 0;
  };

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('FoodDetails', {
          foodId: foodId,
        });
      }}
      activeOpacity={0.8}
      className="m-2"
    >
      <Card
        mode="outlined"
        style={{
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.outline + '30',
          borderRadius: cardDimensions.borderRadius,
          width: cardDimensions.width,
          height: cardDimensions.height,
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
        {/* Card content with horizontal layout */}
        <View 
          className="flex-row items-center relative"
          style={{ padding: cardDimensions.padding }}
        >
          {/* Left side - Food Image with PROMO badge */}
          <View className="relative mr-4">
            <Image
              source={getImageSource()}
              style={{
                width: cardDimensions.imageSize,
                height: cardDimensions.imageSize,
                borderRadius: cardDimensions.borderRadius * 0.6, // Proportional to card border radius
              }}
              resizeMode="cover"
            />
            {/* PROMO Badge - Only show if hasPromo is true */}
            {hasPromo && (
              <View
                className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md"
                style={{ backgroundColor: colors.primary }}
              >
                <Text 
                  className="text-white font-bold"
                  style={{ fontSize: cardDimensions.badgeSize }}
                >
                  PROMO
                </Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            onPress={onLike}
            className="absolute top-2.5 right-2.5 p-2 rounded-full shadow-sm"
            style={{ backgroundColor: colors.surface }}
            activeOpacity={0.7}
          >
            <IoniconsIcon
              name={loved ? 'heart' : 'heart-outline'}
              size={18}
              color={loved ? '#e0245e' : colors.onSurface}
            />
          </TouchableOpacity>

          {/* Right side - Food Details */}
          <View className="flex-1" style={{ minWidth: 0, flexShrink: 1 }}>
            {/* Food Name */}
            <Text
              className="font-bold mb-2 p-1"
              style={{
                color: colors.onSurface,
                fontSize: cardDimensions.foodNameSize,
                lineHeight: cardDimensions.foodNameSize * 1.2,
              }}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {FoodName}
            </Text>

            {/* Distance */}
            <View className="flex-row items-center mb-2 flex-wrap">
              <Text 
                style={{ 
                  color: colors.onSurface,
                  fontSize: cardDimensions.distanceSize,
                }}
              >
                {getDistance().toFixed(1)} km
              </Text>
              {!isAvailable && (
                <>
                  <Text
                    className="mx-1"
                    style={{ 
                      color: colors.onSurface,
                      fontSize: cardDimensions.distanceSize,
                    }}
                  >
                    |
                  </Text>
                  <Text 
                    className="font-bold text-red-500"
                    style={{ fontSize: cardDimensions.distanceSize }}
                  >
                    UNAVAILABLE
                  </Text>
                </>
              )}
            </View>

            {/* Price and Delivery */}
            <View className="flex-row items-center justify-between flex-wrap">
              <View
                className="flex-row items-center flex-shrink"
                style={{ minWidth: 0 }}
              >
                <Text
                  className="font-bold"
                  style={{
                    color: colors.primary,
                    fontSize: cardDimensions.priceSize,
                    flexShrink: 1,
                  }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {getFormattedPrice()} XAF
                </Text>
                <Text
                  className="ml-1"
                  style={{ 
                    color: colors.onSurface,
                    fontSize: cardDimensions.deliverySize,
                  }}
                >
                  |
                </Text>
                <IoniconsIcon
                  name="car-sharp"
                  size={cardDimensions.deliverySize}
                  color={primaryColor}
                  className="ml-1"
                />
                <Text
                  className="ml-1"
                  style={{ 
                    color: colors.onSurface,
                    fontSize: cardDimensions.deliverySize,
                  }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {getDeliveryFee().toFixed(0)} F
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default FoodItemCard;
