import { IoniconsIcon, MaterialIcon } from '@/src/components/common/icons';
import { TouchableOpacity, View, Text } from 'react-native';
import React from 'react';
import { Card, useTheme } from 'react-native-paper';
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

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        navigation.navigate('FoodDetails', {
          foodId: id,
        });
      }}
    >
      <Card
        mode="outlined"
        className="overflow-hidden rounded-2xl shadow-lg my-3"
        style={{
          width: 190,
          backgroundColor: colors.surface,
          borderColor: colors.outline,
        }}
      >
        <View className="p-3">
          {/* Image with heart icon overlay */}
          <View className="relative mb-3">
            <Card.Cover
              source={imageUrl ? { uri: imageUrl } : images.onboarding2}
              style={{
                height: 150,
                width: 150,
                borderRadius: 75,
                alignSelf: 'center',
              }}
            />
            <TouchableOpacity className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-sm">
              <IoniconsIcon name="heart-outline" color={'#ff6b6b'} size={20} />
            </TouchableOpacity>

            {/* Status badge */}
            {(status || !isAvailable) && (
              <View className={`absolute top-2 left-2 rounded-md px-2 py-1 ${
                !isAvailable ? 'bg-red-500' : 'bg-blue-500'
              }`}>
                <Text className="text-white text-xs font-bold text-center">
                  {!isAvailable ? t('sold_out') : (status || 'AVAILABLE')}
                </Text>
              </View>
            )}
          </View>

          {/* Food info */}
          <View className="mb-2 self-center">
            <Text
              className="font-semibold mb-1 text-center text-lg"
              style={{ color: colors.onSurface }}
              numberOfLines={1}
            >
              {foodName || 'N/A'}
            </Text>
            <Text
              className="mb-2 text-center text-base"
              style={{ color: colors.onSurface }}
              numberOfLines={1}
            >
              {restaurantName || 'N/A'}
            </Text>
          </View>

          {/* Rating and distance */}
          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-row items-center">
              <IoniconsIcon name="star" size={16} color={'#ffbb00'} />
              <Text
                className="text-sm ml-1"
                style={{ color: colors.onSurface }}
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
                className="text-sm ml-1"
                style={{ color: colors.onSurface }}
              >
                {distance ? `${distance.toFixed(1)}km` : 'N/A'}
              </Text>
            </View>
          </View>

          {/* Price and delivery info */}
          <View className="flex-row justify-between items-center">
            <Text
              className="font-bold text-base"
              style={{ color: colors.primary }}
            >
              {foodPrice ? `${typeof foodPrice === 'string' ? parseFloat(foodPrice) : foodPrice} XAF` : 'N/A'}
            </Text>
            <View className="flex-row items-center">
              <MaterialIcon
                name="delivery-dining"
                color={colors.primary}
                size={18}
              />
              <Text
                className="ml-1 text-xs"
                style={{ color: colors.onSurface }}
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
