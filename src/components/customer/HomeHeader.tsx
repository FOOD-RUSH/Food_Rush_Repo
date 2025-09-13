// HomeHeader.tsx - Updated with production UX
import React, { useCallback } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Avatar, useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { icons } from '@/assets/images';
import { useTranslation } from 'react-i18next';
import { useLocation } from '@/src/location/useLocation';
import { useCartItems } from '@/src/stores/customerStores/cartStore';

interface HomeHeaderProps {
  navigation: any;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');
  const cartItems = useCartItems();

  const {
    location,
    isLoading: locationLoading,
    error: locationError,
    hasPermission,
    isUsingFallback,
    requestPermissionWithLocation,
    refreshLocation,
    showLocationPermissionDialog,
  } = useLocation({
    autoRequest: true, // Get cached/fallback location on mount
    requestOnMount: false, // Don't auto-request permission (better UX)
  });

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const getDisplayAddress = () => {
    if (locationLoading) {
      return t('getting_location', 'Getting your location...');
    }

    if (!location) {
      return t('select_location', 'Tap to set location');
    }

    return (
      location.exactLocation ||
      location.city ||
      t('select_location', 'Tap to set location')
    );
  };

  const handleLocationPress = useCallback(async () => {
    if (!hasPermission) {
      // Show contextual permission dialog
      showLocationPermissionDialog(
        async () => {
          await requestPermissionWithLocation();
        },
        () => {
          // User cancelled - they can still use the app with fallback location
          console.log('User cancelled location permission');
        }
      );
    } else if (locationError || isUsingFallback) {
      // Try to refresh location
      await refreshLocation();
    } else {
      // Navigate to location picker/search
      navigation.navigate('LocationPicker');
    }
  }, [
    hasPermission,
    locationError,
    isUsingFallback,
    showLocationPermissionDialog,
    requestPermissionWithLocation,
    refreshLocation,
    navigation,
  ]);

  const getLocationIcon = () => {
    if (locationLoading) return 'time-outline';
    if (locationError && !hasPermission) return 'location-outline';
    if (isUsingFallback) return 'location-outline';
    return 'chevron-down';
  };

  const getLocationIconColor = () => {
    if (locationError && !hasPermission) return colors.error;
    if (isUsingFallback) return colors.onSurfaceVariant;
    return colors.onSurfaceVariant;
  };

  return (
    <View
      className="flex-row items-center justify-between px-4 py-4"
      style={{ backgroundColor: colors.background }}
    >
      {/* Left Section - Avatar and Location */}
      <View className="flex-row items-center flex-1">
        <Avatar.Image
          source={icons.appleIcon}
          size={70}
          style={{ backgroundColor: colors.surfaceVariant }}
        />

        <View className="ml-3 flex-1">
          <Text className="text-xs mb-1" style={{ color: colors.onSurfaceVariant }}>
            {t('deliver_to', 'Deliver to')}
          </Text>

          <TouchableOpacity
            className="flex-row items-center"
            onPress={handleLocationPress}
            activeOpacity={0.7}
            disabled={locationLoading}
          >
            <View className="flex-1">
              <Text
                className="font-medium text-base"
                style={{
                  color: locationLoading
                    ? colors.onSurfaceVariant
                    : colors.onSurface,
                }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {getDisplayAddress()}
              </Text>

              {/* Status indicators */}
              {isUsingFallback && !locationLoading && (
                <View className="flex-row items-center mt-1">
                  <View className="px-2 py-0.5 bg-orange-100 rounded-full">
                    <Text className="text-white text-xs font-bold">
                {cartItemCount > 99 ? '99+' : cartItemCount}
              </Text>
            </View>
          )}
          <Ionicons name="bag-outline" color={colors.onSurface} size={22} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default React.memo(HomeHeader);

