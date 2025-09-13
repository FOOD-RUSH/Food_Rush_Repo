import { images } from '@/assets/images';
import { CustomerHomeStackScreenProps } from '@/src/navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useTheme, Card, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

interface RestaurantCardProps {
  name: string;
  address: string;
  isOpen: boolean;
  verificationStatus: 'PENDING_VERIFICATION' | 'APPROVED';
  rating: number | null;
  ratingCount: number;
  id: string;
  deliveryPrice?: number;
  estimatedTime?: number;
  image?: any; // Default image since not in API
  distance?: number;
}

export const RestaurantCard = ({
  name,
  address,
  isOpen = true,
  verificationStatus,
  rating = null,
  ratingCount = 0,
  id,
  image,
  deliveryPrice = 500,
  estimatedTime = 20,
}: RestaurantCardProps) => {
  const navigation =
    useNavigation<CustomerHomeStackScreenProps<'HomeScreen'>['navigation']>();
  const { colors } = useTheme();
  const { t } = useTranslation('translation');

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('RestaurantDetails', {
          restaurantId: id,
        });
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
          minWidth: 320,
          maxWidth: 520,
          minHeight: 220, // Added min card length
          maxHeight: 340, // Added max card length
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
            <Ionicons name="heart-outline" size={20} color={colors.onSurface} />
          </TouchableOpacity>

          {/* Bottom badges */}
          <View
            style={{
              position: 'absolute',
              bottom: 12,
              right: 12,
              flexDirection: 'row',
              gap: 8,
            }}
          >
            {/* Status badge */}

            {/* Open/Closed status */}
            <View
              style={{
                backgroundColor: isOpen ? '#4CAF50' : '#F44336',
                borderRadius: 16,
                paddingHorizontal: 8,
                paddingVertical: 4,
                elevation: 2,
              }}
            >
              <Text
                style={{ fontSize: 10, color: 'white', fontWeight: 'bold' }}
              >
                {isOpen ? 'OPEN' : 'CLOSED'}
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
                {rating} ({ratingCount})
              </Text>
            </View>
          </View>
        </View>

        <Card.Content style={{ padding: 16 }}>
          <View
            style={{ marginBottom: 12 }}
            className="flex-row justify-between"
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: colors.onSurface,
              }}
            >
              {name}
            </Text>
          </View>

          {/* Address display */}
          {address && (
            <View style={{ marginBottom: 8 }}>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.onSurfaceVariant,
                }}
                numberOfLines={1}
              >
                📍 {address}
              </Text>
            </View>
          )}

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.primary,
                  fontWeight: '600',
                }}
              >
                {deliveryPrice} XAF delivery
              </Text>
            </View>

            <View style={{ alignItems: 'flex-end' }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '500',
                  color: colors.onSurface,
                }}
              >
                {estimatedTime}-{estimatedTime + 10} min
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};
