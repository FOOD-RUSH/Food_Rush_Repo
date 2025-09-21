import { images } from '@/assets/images';
import { CustomerHomeStackScreenProps } from '@/src/navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useTheme, Card } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { Typography, Heading4, Body, Label, Caption } from '@/src/components/common/Typography';

interface RestaurantCardProps {
  id: string;
  name: string;
  address: string;
  rating: number | null;
  ratingCount: number;
  distance?: number; // This will be distanceKm from API
  deliveryPrice?: number; // Optional since API doesn't provide it
  image?: string | null; // Optional since API might not provide it
  estimatedDeliveryTime?: string; // Optional since API doesn't provide it
  menu?: any[]; // Optional
  isOpen?: boolean; // From API
  phone?: string; // From API
}

export const RestaurantCard = ({
  id,
  name,
  address,
  rating,
  ratingCount,
  distance,
  deliveryPrice,
  image,
  estimatedDeliveryTime,
  menu,
  isOpen,
  phone,
}: RestaurantCardProps) => {
  const navigation =
    useNavigation<CustomerHomeStackScreenProps<'HomeScreen'>['navigation']>();
  const { colors } = useTheme();
  const { t } = useTranslation('translation');

  // Calculate estimated delivery time based on distance
  const getEstimatedDeliveryTime = () => {
    if (estimatedDeliveryTime) return estimatedDeliveryTime;
    if (!distance) return '30-40 mins';
    
    // Rough calculation: 2-3 km per 10 minutes + 15 min prep time
    const baseTime = 15; // Base preparation time
    const travelTime = Math.ceil(distance * 4); // ~4 minutes per km
    const totalTime = baseTime + travelTime;
    const minTime = totalTime;
    const maxTime = totalTime + 10;
    
    return `${minTime}-${maxTime} mins`;
  };

  // Calculate delivery price based on distance
  const getDeliveryPrice = () => {
    if (deliveryPrice !== undefined) return deliveryPrice;
    if (!distance) return 500; // Default delivery price
    
    // Rough calculation: 300 base + 200 per km
    const basePrice = 300;
    const pricePerKm = 200;
    return Math.round(basePrice + (distance * pricePerKm));
  };

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
            source={image ? { uri: image } : images.onboarding2}
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
              <Caption color="white" style={{ marginLeft: 4 }}>
                {rating?.toString() || 'N/A'} ({ratingCount?.toString() || '0'})
              </Caption>
            </View>
          </View>
        </View>

        <Card.Content style={{ padding: 16 }}>
          <View
            style={{ marginBottom: 12 }}
            className="flex-row justify-between items-center"
          >
            <Heading4 
              color={colors.onSurface} 
              weight="bold"
              style={{ flex: 1 }}
            >
              {name}
            </Heading4>
            
            {/* Open/Closed Status */}
            {isOpen !== undefined && (
              <View
                style={{
                  backgroundColor: isOpen ? colors.primaryContainer : colors.errorContainer,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 12,
                  marginLeft: 8,
                }}
              >
                <Caption
                  color={isOpen ? colors.onPrimaryContainer : colors.onErrorContainer}
                  weight="medium"
                >
                  {isOpen ? t('open') : t('closed')}
                </Caption>
              </View>
            )}
          </View>

          {/* Address display */}
          {address && (
            <View style={{ marginBottom: 8 }}>
              <Body 
                color={colors.onSurfaceVariant}
                numberOfLines={1}
              >
                📍 {address}
              </Body>
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
              <Label 
                color={colors.primary} 
                weight="semibold"
              >
                {getDeliveryPrice()} XAF delivery
              </Label>
            </View>

            <View style={{ alignItems: 'flex-end' }}>
              <Label 
                color={colors.onSurface} 
                weight="medium"
              >
                {getEstimatedDeliveryTime()}
              </Label>
              {distance !== undefined && (
                <Caption 
                  color={colors.onSurfaceVariant}
                  style={{ marginTop: 2 }}
                >
                  {distance ? (Math.round((distance) * 10) / 10).toFixed(1) : '0.0'} km
                </Caption>
              )}
            </View>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};
