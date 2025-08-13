import { images } from '@/assets/images';
import { CustomerHomeStackScreenProps } from '@/src/navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useTheme,Card, Text } from 'react-native-paper';

interface RestaurantCardProps {
  deliveryFee: number;
  restaurantName: string;
  distanceFromUser: number;
  estimatedTime: any;
  rating: number;
  image: any;
  restaurantID: string;
  discount?: string; // Optional discount text
  discountColor?: string; // Optional discount background color
}

export const RestaurantCard = ({
  deliveryFee,
  restaurantID,
  restaurantName,
  distanceFromUser,
  estimatedTime,
  rating,
  image,
  discount,
  discountColor = '#ff4444',
}: RestaurantCardProps) => {
  const navigation =
    useNavigation<CustomerHomeStackScreenProps<'HomeScreen'>['navigation']>();
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('RestaurantDetails', { restaurantId: 'paulo' });
      }}
      activeOpacity={0.9}
    >
      <Card
        mode="outlined"
        style={{
          margin: 10,
          borderRadius: 16,
          overflow: 'hidden',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          backgroundColor: colors.surface,
          borderWidth: 1,
          marginVertical: 12,
          borderColor: colors.surface,
          boxShadow: '1px 0px 10px rgba(0, 0, 0, 0.15)',
        }}
      >
        <View style={{ position: 'relative' }}>
          <Card.Cover
            source={image || images.onboarding2}
            style={{
              height: 150,
              width: '100%',
            }}
            resizeMode="cover"
          />

          {/* Heart Icon */}
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              // Handle favorite toggle
            }}
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              backgroundColor: colors.surface,
              borderRadius: 20,
              padding: 8,
              elevation: 3,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            }}
            activeOpacity={0.7}
          >
            <Ionicons
              name="heart-outline"
              size={20}
              color={colors.onSurface}
            />
          </TouchableOpacity>

          {/* Discount Badge - Only show if discount prop is provided */}
          {discount && (
            <View
              style={{
                position: 'absolute',
                top: 12,
                left: 12,
                backgroundColor: discountColor,
                borderRadius: 12,
                paddingHorizontal: 12,
                paddingVertical: 6,
                elevation: 2,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
              }}
            >
              <Text
                style={{
                  color: 'white',
                  fontSize: 12,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}
              >
                {discount}
              </Text>
            </View>
          )}

          {/* Bottom badges */}
          <View
            style={{
              position: 'absolute',
              bottom: 12,
              left: 12,
              flexDirection: 'row',
              gap: 8,
            }}
          >
            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: 16,
                paddingHorizontal: 12,
                paddingVertical: 6,
                elevation: 2,
              }}
            >
              <Text
                style={{ fontSize: 12, fontWeight: 'bold', color: colors.onSurface }}
              >
                {deliveryFee}F
              </Text>
            </View>
            <View
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                borderRadius: 16,
                paddingHorizontal: 12,
                paddingVertical: 6,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Ionicons name="star" size={12} color="yellow" />
              <Text style={{ fontSize: 12, color: 'white', marginLeft: 4 }}>
                {rating}
              </Text>
            </View>
          </View>
        </View>

        <Card.Content style={{ padding: 16 }}>
          <View style={{ marginBottom: 12 }}>
            <Text
              style={{ fontSize: 18, fontWeight: 'bold', color: colors.onSurface }}
            >
              {restaurantName}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 4,
                }}
              >
                <Ionicons name="location" size={14} color={colors.primary} />
                <Text
                  style={{ fontSize: 14, color: colors.primary, marginLeft: 4 }}
                >
                  {distanceFromUser}km
                </Text>
              </View>
              <Text style={{ fontSize: 12, color: colors.onSurface }}>
                {deliveryFee}FCFA Delivery Fee
              </Text>
            </View>

            <View style={{ alignItems: 'flex-end' }}>
              <Text
                style={{ fontSize: 14, fontWeight: '500', color: colors.onSurface }}
              >
                {estimatedTime}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};
