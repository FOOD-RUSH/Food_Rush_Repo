import { CustomerHomeStackScreenProps } from '@/src/navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useResponsive } from '@/src/hooks/useResponsive';
import { ResponsiveImage, ResponsiveText } from '@/src/components/common';

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
    >
      <Card
        mode="outlined"
        style={{
          margin: getResponsiveSpacing(8),
          borderRadius: 16,
          overflow: 'hidden',
          backgroundColor: colors.surface,
          marginVertical: getResponsiveSpacing(12),
          borderColor: colors.surface,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.15,
          shadowRadius: 3,
          elevation: 3,
          boxShadow: '1px 0px 10px rgba(0, 0, 0, 0.15)',
          minWidth: isSmallDevice ? scale(280) : scale(320),
          maxWidth: isSmallDevice ? scale(360) : scale(520),
          minHeight: scale(120),
          maxHeight: scale(180),
        }}
      >
        {/* Card content with horizontal layout */}
        <View
          style={{
            flexDirection: 'row',
            padding: getResponsiveSpacing(16),
            alignItems: 'center',
            position: 'relative',
          }}
        >
          {/* Left side - Food Image with PROMO badge */}
          <View
            style={{
              position: 'relative',
              marginRight: getResponsiveSpacing(16),
            }}
          >
            <ResponsiveImage
              source={FoodImage}
              size={isSmallDevice ? 'md' : 'lg'}
              aspectRatio={1}
              style={{
                borderRadius: 16,
              }}
            />
            {/* PROMO Badge - Only show if hasPromo is true */}
            {hasPromo && (
              <View
                style={{
                  position: 'absolute',
                  top: 6,
                  left: 6,
                  backgroundColor: colors.primary,
                  borderRadius: 6,
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                }}
              >
                <Text
                  style={{
                    color: 'white',
                    fontSize: 10,
                    fontWeight: 'bold',
                  }}
                >
                  PROMO
                </Text>
              </View>
            )}
          </View>
          <TouchableOpacity
            onPress={onLike}
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              backgroundColor: colors.surface,
              borderRadius: 20,
              padding: 8,
              elevation: 2,
            }}
            activeOpacity={0.7}
          >
            <Ionicons
              name={loved ? 'heart' : 'heart-outline'}
              size={18}
              color={loved ? '#e0245e' : colors.onSurface}
            />
          </TouchableOpacity>

          {/* Right side - Food Details */}
          <View style={{ flex: 1 }}>
            {/* Food Name */}
            <ResponsiveText
              size={isSmallDevice ? 'base' : 'lg'}
              weight="bold"
              style={{
                marginBottom: getResponsiveSpacing(8),
                padding: 4,
                color: colors.onSurface,
              }}
            >
              {FoodName}
            </ResponsiveText>

            {/* Distance */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <Text className={`text-[12px] ${colors.onSurface}`}>
                {(distanceKm || distanceFromUser).toFixed(1)} km
              </Text>
              {!isAvailable && (
                <>
                  <Text
                    style={{
                      color: colors.onSurface,
                      fontSize: 12,
                      marginHorizontal: 4,
                    }}
                  >
                    |
                  </Text>
                  <Text
                    style={{
                      color: '#F44336',
                      fontSize: 12,
                      fontWeight: 'bold',
                    }}
                  >
                    UNAVAILABLE
                  </Text>
                </>
              )}
            </View>

            {/* Price and Delivery */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <ResponsiveText
                  size={isSmallDevice ? 'base' : 'lg'}
                  weight="bold"
                  style={{
                    color: colors.primary,
                  }}
                >
                  {FoodPrice} XAF
                </ResponsiveText>
                <Text
                  style={{
                    color: colors.onSurface,
                    fontSize: 12,
                    marginLeft: 5,
                  }}
                >
                  |
                </Text>
                <Ionicons
                  name="car-sharp"
                  size={12}
                  color={primaryColor}
                  style={{ marginLeft: 5 }}
                />
                <Text
                  style={{
                    color: colors.onSurface,
                    fontSize: 12,
                    marginLeft: 5,
                  }}
                >
                  {DeliveryPrice.toFixed(0)} F
                </Text>
              </View>

              {/* Heart Icon */}
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default FoodItemCard;
