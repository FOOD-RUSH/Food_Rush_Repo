import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Card, Text } from 'react-native-paper';

export interface FoodItemCardProps {
  FoodName: string;
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
}: FoodItemCardProps) => (
  <Card
    mode="outlined"
    style={{
      margin: 10,
      borderRadius: 16,
      overflow: 'hidden',
      borderColor: '#e0e0e0',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
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
            backgroundColor: '#007aff',
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
          <Text className="text-[12px]">{distanceFromUser.toFixed(0)} km</Text>
          <Text style={{ color: '#A0A0A0', fontSize: 12, marginHorizontal: 4 }}>
            |
          </Text>
          <Ionicons name="star" size={12} color="#FFD700" />
          <Text style={{ color: '#A0A0A0', fontSize: 12, marginLeft: 2 }}>
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
                color: '#007aff',
                fontSize: 16,
                fontWeight: 'bold',
              }}
            >
              {FoodPrice}
            </Text>
            <Text style={{ color: '#A0A0A0', fontSize: 12, marginLeft: 5 }}>
              |
            </Text>
            <Ionicons
              name="car-sharp"
              size={12}
              color="#007aff"
              style={{ marginLeft: 5 }}
            />
            <Text style={{ color: '#A0A0A0', fontSize: 12, marginLeft: 5 }}>
              ${DeliveryPrice.toFixed(0)}
            </Text>
          </View>

          {/* Heart Icon */}
          <TouchableOpacity
            onPress={onLike}
            style={{
              backgroundColor: 'white',
              borderRadius: 20,
              padding: 8,
              elevation: 2,
            }}
            activeOpacity={0.7}
          >
            <Ionicons
              name={loved ? 'heart' : 'heart-outline'}
              size={18}
              color={loved ? '#e0245e' : '#333'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Card>
);

export default FoodItemCard;
