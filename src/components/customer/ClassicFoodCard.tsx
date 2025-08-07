import { TouchableOpacity, View, Text } from 'react-native';
import React from 'react';
import { Card } from 'react-native-paper';
import { images } from '@/assets/images';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { CustomerHomeStackScreenProps } from '@/src/navigation/types';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/src/hooks/useTheme';

interface ClassicFoodCardProps {
  id: string;
  foodName?: string;
  foodPrice?: number;
  restaurantName?: string;
  distance?: number;
  rating?: number;
  status?: string;
}

const ClassicFoodCard = ({
  id,
  foodName = 'Egg & Pasta',
  foodPrice = 650,
  restaurantName = 'Resto Chez Dialo',
  distance = 190,
  rating = 4.9,
  status = 'PROMO',
}: ClassicFoodCardProps) => {
  const navigation =
    useNavigation<CustomerHomeStackScreenProps<'HomeScreen'>['navigation']>();
  const { theme } = useTheme();
  const cardBackgroundColor = theme === 'light' ? 'white' : '#1e293b';
  const textColor = theme === 'light' ? 'text-gray-800' : 'text-text';
  const secondaryTextColor =
    theme === 'light' ? 'text-gray-500' : 'text-text-secondary';
  const primaryColor = theme === 'light' ? '#007aff' : '#3b82f6';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        navigation.navigate('FoodDetails', { foodId: id, restaurantId: '1' });
      }}
    >
      <Card
        mode="outlined"
        className="overflow-hidden"
        style={{
          width: 190,
          borderRadius: 16,
          backgroundColor: cardBackgroundColor,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          borderWidth: 1,
          marginVertical: 12,
          borderColor: cardBackgroundColor,
          boxShadow: '1px 0px 10px rgba(0, 0, 0, 0.15)',
        }}
      >
        <View className="p-3">
          {/* Image with heart icon overlay */}
          <View className="relative mb-3">
            <Card.Cover
              source={images.onboarding2}
              style={{
                height: 150,
                width: 150,
                borderRadius: 75,
                alignSelf: 'center',
              }}
            />
            <TouchableOpacity
              className="absolute top-2 right-2 bg-white rounded-full p-1.5"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
                elevation: 3,
              }}
            >
              <Ionicons name="heart-outline" color={'#ff6b6b'} size={20} />
            </TouchableOpacity>

            {/* Status badge */}
            <View className="absolute top-2 left-2 bg-blue-500 rounded-md px-2 py-1">
              <Text
                style={{
                  color: 'white',
                  fontSize: 11,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}
              >
                {status}
              </Text>
            </View>
          </View>

          {/* Food info */}
          <View className="mb-2 self-center">
            <Text
              className={`font-semibold mb-1 text-center text-lg ${textColor}`}
              numberOfLines={1}
            >
              {foodName}
            </Text>
            <Text
              className={`mb-2 text-center text-base ${secondaryTextColor}`}
              numberOfLines={1}
            >
              {restaurantName}
            </Text>
          </View>

          {/* Rating and distance */}
          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-row items-center">
              <Ionicons name="star" size={16} color={'#ffbb00'} />
              <Text className={`text-sm ml-1 ${secondaryTextColor}`}>
                {rating}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons
                name="location-outline"
                size={16}
                color={primaryColor}
              />
              <Text className={`text-sm ml-1 ${secondaryTextColor}`}>
                {distance}m
              </Text>
            </View>
          </View>

          {/* Price and delivery info */}
          <View className="flex-row justify-between items-center">
            <Text
              className="font-bold text-base"
              style={{ color: primaryColor }}
            >
              {foodPrice} FCFA
            </Text>
            <View className="flex-row items-center">
              <MaterialIcons
                name="delivery-dining"
                color={primaryColor}
                size={18}
              />
              <Text className={`ml-1 text-xs ${secondaryTextColor}`}>
                SOLD OUT
              </Text>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default ClassicFoodCard;
