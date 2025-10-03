import { IoniconsIcon } from '@/src/components/common/icons';
import { CustomerHomeStackScreenProps } from '@/src/navigation/types';

import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useResponsive } from '@/src/hooks/useResponsive';
import { images } from '@/assets/images';
import { Dimensions } from 'react-native';

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
  const { isSmallScreen, isTablet, isLargeScreen, wp, scale, getResponsiveText } = useResponsive();
  
  // Calculate responsive dimensions
  const getCardDimensions = () => {
    if (isLargeScreen) {
      return {
        width: Math.min(wp(45), 380), // Max 380px width
        height: 140,
        imageSize: 90,
      };
    } else if (isTablet) {
      return {
        width: Math.min(wp(48), 320), // Max 320px width
        height: 130,
        imageSize: 85,
      };
    } else {
      return {
        width: Math.min(wp(85), 280), // Max 280px width for phones
        height: 120,
        imageSize: 80,
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
      return { uri: pictureUrl.startsWith('http') ? pictureUrl : `${baseUrl}${pictureUrl}` };
    }
    if (FoodImage) {
      return FoodImage;
    }
    return images.onboarding2;
  };

  const getFormattedPrice = () => {
    const price = typeof FoodPrice === 'string' ? parseFloat(FoodPrice) : FoodPrice;
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
        mode="elevated"
        className="rounded-2xl overflow-hidden shadow-lg"
        style={{
          backgroundColor: colors.surface,
          borderColor: 'transparent',
          width: cardDimensions.width,
          height: cardDimensions.height,
          elevation: 6,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.15,
          shadowRadius: 6,
        }}
      >
        {/* Card content with horizontal layout */}
        <View className="flex-row p-4 items-center relative">
          {/* Left side - Food Image with PROMO badge */}
          <View className="relative mr-4">
            <Image
              source={getImageSource()}
              className="rounded-2xl"
              style={{
                width: cardDimensions.imageSize,
                height: cardDimensions.imageSize,
              }}
              resizeMode="cover"
            />
            {/* PROMO Badge - Only show if hasPromo is true */}
            {hasPromo && (
              <View
                className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md"
                style={{ backgroundColor: colors.primary }}
              >
                <Text className="text-white text-xs font-bold">PROMO</Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            onPress={onLike}
            className="absolute top-2.5 right-2.5 p-2 rounded-full shadow-sm"
            style={{ backgroundColor: colors.surface }}
            activeOpacity={0.7}
          >
            <IoniconsIcon               name={loved ? 'heart' : 'heart-outline'}
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
                fontSize: getResponsiveText(isSmallScreen ? 14 : 16),
                lineHeight: getResponsiveText(isSmallScreen ? 18 : 20),
              }}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {FoodName}
            </Text>

            {/* Distance */}
            <View className="flex-row items-center mb-2 flex-wrap">
              <Text className="text-xs" style={{ color: colors.onSurface }}>
                {getDistance().toFixed(1)} km
              </Text>
              {!isAvailable && (
                <>
                  <Text
                    className="text-xs mx-1"
                    style={{ color: colors.onSurface }}
                  >
                    |
                  </Text>
                  <Text className="text-xs font-bold text-red-500">
                    UNAVAILABLE
                  </Text>
                </>
              )}
            </View>

            {/* Price and Delivery */}
            <View className="flex-row items-center justify-between flex-wrap">
              <View className="flex-row items-center flex-shrink" style={{ minWidth: 0 }}>
                <Text
                  className="font-bold"
                  style={{ 
                    color: colors.primary,
                    fontSize: getResponsiveText(isSmallScreen ? 14 : 16),
                    flexShrink: 1,
                  }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {getFormattedPrice()} XAF
                </Text>
                <Text
                  className="text-xs ml-1"
                  style={{ color: colors.onSurface }}
                >
                  |
                </Text>
                <IoniconsIcon                   name="car-sharp"
                  size={12}
                  color={primaryColor}
                  className="ml-1"
                />
                <Text
                  className="text-xs ml-1"
                  style={{ color: colors.onSurface }}
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
