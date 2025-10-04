import { IoniconsIcon } from '@/src/components/common/icons';
import { images } from '@/assets/images';
import { CustomerHomeStackScreenProps } from '@/src/navigation/types';

import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity, View, Dimensions } from 'react-native';
import { useTheme, Card } from 'react-native-paper';
import { useResponsive } from '@/src/hooks/useResponsive';

const { width: screenWidth } = Dimensions.get('window');
import { useTranslation } from 'react-i18next';
import {
  Typography,
  Heading4,
  Body,
  Label,
  Caption,
} from '@/src/components/common/Typography';
import { useLocationStatus } from '@/src/hooks/customer/useLocationService';

interface RestaurantCardProps {
  id: string;
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  isOpen: boolean;
  verificationStatus: string;
  menuMode: string;
  createdAt: string;
  distanceKm: number;
  deliveryPrice: number;
  estimatedDeliveryTime: string;
  rating: number | null;
  ratingCount: number;
  // Optional fields for UI enhancement
  image?: string | null;
  phone?: string;
  menu?: any[];
}

export const RestaurantCard = ({
  id,
  name,
  address,
  latitude,
  longitude,
  isOpen,
  verificationStatus,
  menuMode,
  createdAt,
  distanceKm,
  deliveryPrice,
  estimatedDeliveryTime,
  rating,
  ratingCount,
  image,
  phone,
  menu,
}: RestaurantCardProps) => {
  const navigation =
    useNavigation<CustomerHomeStackScreenProps<'HomeScreen'>['navigation']>();
  const { colors } = useTheme();
  const { t } = useTranslation('translation');
  const { isSmallScreen, isTablet, isLargeScreen, wp, getResponsiveText } =
    useResponsive();

  // Calculate responsive dimensions
  const getCardDimensions = () => {
    if (isLargeScreen) {
      return {
        width: Math.min(wp(90), 500), // Max 500px width
        imageHeight: 180,
        padding: 16,
      };
    } else if (isTablet) {
      return {
        width: Math.min(wp(95), 400), // Max 400px width
        imageHeight: 160,
        padding: 14,
      };
    } else {
      return {
        width: wp(90), // 90% of screen width for phones
        imageHeight: 140,
        padding: 12,
      };
    }
  };

  const cardDimensions = getCardDimensions();

  const { hasRealLocation, isUsingFallback, locationSource } =
    useLocationStatus();

  // Use backend-provided data directly (no calculations needed)
  const displayEstimatedDeliveryTime = estimatedDeliveryTime;
  const displayDeliveryPrice = deliveryPrice;

  // Format distance display with location context
  const getDistanceDisplay = () => {
    const formattedDistance = (Math.round(distanceKm * 10) / 10).toFixed(1);
    const locationContext = isUsingFallback ? ' (approx.)' : '';

    return `${formattedDistance} km${locationContext}`;
  };

  // Format rating display
  const getRatingDisplay = () => {
    if (rating === null || rating === undefined) {
      return ratingCount > 0 ? 'New' : 'N/A';
    }
    return rating.toFixed(1);
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
          margin: 8,
          borderRadius: 16,
          overflow: 'hidden',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.12,
          shadowRadius: 6,
          backgroundColor: colors.surface,
          borderWidth: 0.5,
          borderColor: colors.outline + '20',
          width: cardDimensions.width,
          alignSelf: 'center',
          // Add opacity for closed restaurants
          opacity: isOpen ? 1 : 0.7,
        }}
      >
        <View style={{ position: 'relative' }}>
          <Card.Cover
            source={image ? { uri: image } : images.onboarding2}
            style={{
              height: cardDimensions.imageHeight,
              width: '100%',
            }}
            resizeMode="cover"
          />

          {/* Verification badge */}
          {verificationStatus === 'APPROVED' && (
            <View
              style={{
                position: 'absolute',
                top: 12,
                left: 12,
                backgroundColor: colors.primary,
                borderRadius: 12,
                paddingHorizontal: 8,
                paddingVertical: 4,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <IoniconsIcon name="checkmark-circle" size={12} color="white" />
              <Caption color="white" style={{ marginLeft: 4, fontSize: 10 }}>
                Verified
              </Caption>
            </View>
          )}

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
            <IoniconsIcon
              name="heart-outline"
              size={20}
              color={colors.onSurface}
            />
          </TouchableOpacity>

          {/* Rating badge */}
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
              <IoniconsIcon
                name="star"
                size={12}
                color={rating !== null ? 'yellow' : colors.onSurfaceVariant}
              />
              <Caption color="white" style={{ marginLeft: 4 }}>
                {getRatingDisplay()} ({ratingCount})
              </Caption>
            </View>
          </View>

          {/* Closed overlay */}
          {!isOpen && (
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  backgroundColor: colors.errorContainer,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                }}
              >
                <Label color={colors.onErrorContainer} weight="bold">
                  {t('closed')}
                </Label>
              </View>
            </View>
          )}
        </View>

        <Card.Content style={{ padding: cardDimensions.padding }}>
          <View
            style={{ marginBottom: 12 }}
            className="flex-row justify-between items-center"
          >
            <Heading4
              color={colors.onSurface}
              weight="bold"
              style={{
                flex: 1,
                fontSize: getResponsiveText(isSmallScreen ? 16 : 18),
              }}
            >
              {name}
            </Heading4>

            {/* Open/Closed Status */}
            <View
              style={{
                backgroundColor: isOpen
                  ? colors.primaryContainer
                  : colors.errorContainer,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
                marginLeft: 8,
              }}
            >
              <Caption
                color={
                  isOpen ? colors.onPrimaryContainer : colors.onErrorContainer
                }
                weight="medium"
              >
                {isOpen ? t('open') : t('closed')}
              </Caption>
            </View>
          </View>

          {/* Address display */}
          <View style={{ marginBottom: 8 }}>
            <Body color={colors.onSurfaceVariant} numberOfLines={1}>
              📍 {address}
            </Body>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View style={{ flex: 1 }}>
              <Label color={colors.primary} weight="semibold">
                {displayDeliveryPrice} XAF delivery
              </Label>

              {/* Menu mode indicator */}
              <Caption color={colors.onSurfaceVariant} style={{ marginTop: 2 }}>
                {menuMode === 'FIXED' ? 'Fixed menu' : 'Custom menu'}
              </Caption>
            </View>

            <View style={{ alignItems: 'flex-end' }}>
              <Label color={colors.onSurface} weight="medium">
                {displayEstimatedDeliveryTime}
              </Label>
              <View style={{ alignItems: 'flex-end' }}>
                <Caption
                  color={colors.onSurfaceVariant}
                  style={{ marginTop: 2 }}
                >
                  {getDistanceDisplay()}
                </Caption>
                {isUsingFallback && (
                  <Caption
                    color={colors.primary}
                    style={{ marginTop: 1, fontSize: 10 }}
                  >
                    📍 Enable location for accuracy
                  </Caption>
                )}
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};
