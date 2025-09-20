import { CustomerHomeStackScreenProps } from '@/src/navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useResponsive } from '@/src/hooks/useResponsive';
import { images } from '@/assets/images';

export interface FoodItemCardProps {
  foodId: string;
  restaurantId: string;
  FoodName?: string;
  FoodPrice: number;
  FoodImage: any;
  RestaurantName: string;
  distanceFromUser: number;
  DeliveryPrice: number;
  hasPromo?: boolean;
  onLike?: () => void;
  loved?: boolean;
  // Additional props from API
  distanceKm?: number;
  isAvailable?: boolean;
}

const FoodItemCard = ({
  foodId,
  restaurantId,
  FoodName,
  FoodPrice,
  FoodImage,
  RestaurantName,
  distanceFromUser,
  DeliveryPrice,
  hasPromo = false,
  onLike,
  loved = false,
  distanceKm,
  isAvailable = true,
}: FoodItemCardProps) => {
  const navigation =
    useNavigation<CustomerHomeStackScreenProps<'HomeScreen'>['navigation']>();
  const { colors } = useTheme();
  const { t } = useTranslation('translation');
  const { isSmallDevice, getResponsiveSpacing, scale } = useResponsive();

  const primaryColor = colors.primary;

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
        className="rounded-2xl overflow-hidden shadow-md"
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.outline,
          minWidth: isSmallDevice ? scale(280) : scale(320),
          maxWidth: isSmallDevice ? scale(360) : scale(520),
          minHeight: scale(120),
          maxHeight: scale(180),
        }}
      >
        {/* Card content with horizontal layout */}
        <View className="flex-row p-4 items-center relative">
          {/* Left side - Food Image with PROMO badge */}
          <View className="relative mr-4">
            <Image
              source={FoodImage || images.onboarding2}
              className="rounded-2xl"
              style={{
                width: isSmallDevice ? 80 : 100,
                height: isSmallDevice ? 80 : 100,
              }}
              resizeMode="cover"
            />
            {/* PROMO Badge - Only show if hasPromo is true */}
            {hasPromo && (
              <View 
                className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md"
                style={{ backgroundColor: colors.primary }}
              >
                <Text className="text-white text-xs font-bold">
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
            <Ionicons
              name={loved ? 'heart' : 'heart-outline'}
              size={18}
              color={loved ? '#e0245e' : colors.onSurface}
            />
          </TouchableOpacity>

          {/* Right side - Food Details */}
          <View className="flex-1">
            {/* Food Name */}
            <Text 
              className={`${isSmallDevice ? 'text-base' : 'text-lg'} font-bold mb-2 p-1`}
              style={{ color: colors.onSurface }}
              numberOfLines={2}
            >
              {FoodName}
            </Text>

            {/* Distance */}
            <View className="flex-row items-center mb-2">
              <Text 
                className="text-xs"
                style={{ color: colors.onSurface }}
              >
                {(distanceKm || distanceFromUser).toFixed(1)} km
              </Text>
              {!isAvailable && (
                <>
                  <Text className="text-xs mx-1" style={{ color: colors.onSurface }}>|</Text>
                  <Text className="text-xs font-bold text-red-500">
                    UNAVAILABLE
                  </Text>
                </>
              )}
            </View>

            {/* Price and Delivery */}
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Text
                  className={`${isSmallDevice ? 'text-base' : 'text-lg'} font-bold`}
                  style={{ color: colors.primary }}
                >
                  {FoodPrice} XAF
                </Text>
                <Text className="text-xs ml-1" style={{ color: colors.onSurface }}>|</Text>
                <Ionicons
                  name="car-sharp"
                  size={12}
                  color={primaryColor}
                  className="ml-1"
                />
                <Text className="text-xs ml-1" style={{ color: colors.onSurface }}>
                  {DeliveryPrice.toFixed(0)} F
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
