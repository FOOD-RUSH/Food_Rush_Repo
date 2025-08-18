import { CustomerHomeStackScreenProps } from '@/src/navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { useTheme } from 'react-native-paper';

export interface FoodItemCardProps {
  foodId: string;
  restarantId: string;
  FoodName?: string;
  FoodPrice: number;
  FoodImage: any;
  RestarantName: string;
  distanceFromUser: number;
  DeliveryPrice: number;
  onLike?: () => void;
  loved?: boolean;
}

const FoodItemCard = ({
  FoodName,
  FoodPrice,
  FoodImage,
  RestarantName,
  distanceFromUser,
  DeliveryPrice,
  onLike,
  loved = false,
}: FoodItemCardProps) => {
  const [restaurantID, setRestaurantID] = useState('fgfgfgfg');
  const [foodID, setFoodID] = useState('fgfgfgfg');
  const navigation =
    useNavigation<CustomerHomeStackScreenProps<'HomeScreen'>['navigation']>();
  const { colors } = useTheme();

  const primaryColor = colors.primary;

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('FoodDetails', {
          foodId: foodID,
          restaurantId: restaurantID,
        });
      }}
      activeOpacity={0.8}
    >
      <Card
        mode="outlined"
        style={{
          margin: 10,
          borderRadius: 16,
          overflow: 'hidden',
          backgroundColor: colors.surface,
          marginVertical: 12,
          borderColor: colors.surface,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.15,
          shadowRadius: 3,
          elevation: 3,
          boxShadow: '1px 0px 10px rgba(0, 0, 0, 0.15)',
        }}
      >
        {/* Card content with horizontal layout */}
        <View
          style={{
            flexDirection: 'row',
            padding: 16,
            alignItems: 'center',
          }}
        >
          {/* Left side - Food Image with PROMO badge */}
          <View style={{ position: 'relative', marginRight: 16 }}>
            <Card.Cover
              source={FoodImage}
              style={{
                height: 100,
                width: 100,
                borderRadius: 16,
              }}
            />
            {/* PROMO Badge */}
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
          </View>

          {/* Right side - Food Details */}
          <View style={{ flex: 1 }}>
            {/* Food Name */}
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                marginBottom: 10,
                padding: 4,
                color: colors.onSurface,
              }}
            >
              {FoodName}
            </Text>

            {/* Distance and Rating */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <Text className={`text-[12px] ${colors.onSurface}`}>
                {distanceFromUser.toFixed(0)} km
              </Text>
              <Text
                style={{
                  color: colors.onSurface,
                  fontSize: 12,
                  marginHorizontal: 4,
                }}
              >
                |
              </Text>
              <Ionicons name="star" size={12} color="#FFD700" />
              <Text
                style={{
                  color: colors.onSurface,
                  fontSize: 12,
                  marginLeft: 2,
                }}
              >
                4.9 (1000)
              </Text>
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
                <Text
                  style={{
                    color: colors.primary,
                    fontSize: 16,
                    fontWeight: 'bold',
                  }}
                >
                  {FoodPrice} XAF
                </Text>
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
                  ${DeliveryPrice.toFixed(0)}
                </Text>
              </View>

              {/* Heart Icon */}
              <TouchableOpacity
                onPress={onLike}
                style={{
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
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default FoodItemCard;
