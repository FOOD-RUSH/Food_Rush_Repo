// HomeHeader.tsx - Updated with production UX
import { IoniconsIcon } from '@/src/components/common/icons';
import React, { useCallback, useState } from 'react';
import { TouchableOpacity, View, Text, ActivityIndicator } from 'react-native';
import { useTheme, Badge } from 'react-native-paper';

import { useTranslation } from 'react-i18next';
import { useLocation } from '@/src/location/useLocation';
import { useCartItemCount } from '@/src/stores/customerStores/cartStore';
import NotificationBadge from '@/src/components/common/NotificationBadge';
import { useUser } from '@/src/stores/AuthStore';
import Avatar from '@/src/components/common/Avatar';
import Toast from 'react-native-toast-message';
import { useQueryClient } from '@tanstack/react-query';
import { useNotifications } from '@/src/contexts/SimpleNotificationProvider';

interface HomeHeaderProps {
  navigation: any;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');
  const cartItemCount = useCartItemCount();
  const { unreadCount: unreadNotificationCount } = useNotifications()
  const user = useUser();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();

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

  // Navigation handlers
  const handleNotificationPress = useCallback(() => {
    navigation.push('Notifications'); // Use push() to ensure screen appears on top
  }, [navigation]);

  const handleCartPress = useCallback(() => {
    navigation.push('Cart'); // Use push() to ensure screen appears on top
  }, [navigation]);

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
          const success = await requestPermissionWithLocation();
          if (success) {
            // Permission granted and location obtained - refresh nearby data
            queryClient.invalidateQueries({ queryKey: ['browse-restaurants'] });
            queryClient.invalidateQueries({ queryKey: ['restaurants'] });
            queryClient.invalidateQueries({ queryKey: ['menu'] });

            Toast.show({
              type: 'success',
              text1: t('location_enabled', 'Location enabled'),
              text2: t(
                'showing_nearby_results',
                'Now showing nearby restaurants and food',
              ),
              visibilityTime: 3000,
            });
          }
        },
        () => {
          // User cancelled - they can still use the app with fallback location
        },
      );
    } else {
      // Always refresh location when user taps the header
      // This provides immediate feedback and ensures fresh location data
      await refreshLocation();
    }
  }, [
    hasPermission,
    showLocationPermissionDialog,
    requestPermissionWithLocation,
    refreshLocation,
    queryClient,
    t,
  ]);

  // Handler for the entire header area to refresh location
  const handleHeaderPress = useCallback(async () => {
    // Prevent multiple simultaneous refresh attempts
    if (isRefreshing || locationLoading) {
      return;
    }

    setIsRefreshing(true);

    try {
      // Refresh location when any part of the header is tapped
      if (hasPermission) {
        const success = await refreshLocation();
        if (success) {
          // Manually trigger query invalidation to ensure fresh data
          queryClient.invalidateQueries({ queryKey: ['browse-restaurants'] });
          queryClient.invalidateQueries({ queryKey: ['restaurants'] });
          queryClient.invalidateQueries({ queryKey: ['menu'] });

          Toast.show({
            type: 'success',
            text1: t('location_updated', 'Location updated'),
            text2: t(
              'location_refreshed_successfully',
              'Your location has been refreshed',
            ),
            visibilityTime: 2000,
          });
        } else {
          Toast.show({
            type: 'error',
            text1: t('location_update_failed', 'Location update failed'),
            text2: t('please_try_again', 'Please try again'),
            visibilityTime: 3000,
          });
        }
      } else {
        // If no permission, trigger the location permission flow
        handleLocationPress();
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t('location_error', 'Location error'),
        text2: t('unable_to_refresh_location', 'Unable to refresh location'),
        visibilityTime: 3000,
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [
    hasPermission,
    refreshLocation,
    handleLocationPress,
    isRefreshing,
    locationLoading,
    t,
    queryClient,
  ]);

  const getLocationIcon = () => {
    if (locationLoading || isRefreshing) return 'time-outline';
    if (locationError && !hasPermission) return 'location-outline';
    if (isUsingFallback) return 'location-outline';
    return 'refresh-outline';
  };

  const getLocationIconColor = () => {
    if (locationError && !hasPermission) return colors.error;
    if (isUsingFallback) return colors.onSurfaceVariant;
    return colors.onSurfaceVariant;
  };

  return (
    <TouchableOpacity
      className="flex-row items-center justify-between px-4 py-4"
      style={{ backgroundColor: colors.background }}
      onPress={handleHeaderPress}
      activeOpacity={0.8}
    >
      {/* Left Section - Avatar and Location */}
      <View className="flex-row items-center flex-1">
        <Avatar
          profilePicture={user?.profilePicture}
          fullName={user?.fullName || 'User'}
          size={70}
        />

        <View className="ml-3 flex-1">
          <Text
            className="text-xs mb-1"
            style={{ color: colors.onSurfaceVariant }}
          >
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
                    <Text className="text-orange-600 text-xs font-medium">
                      {t('fallback_location', 'Approximate')}
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {locationLoading || isRefreshing ? (
              <ActivityIndicator
                size={16}
                color={getLocationIconColor()}
                style={{ marginLeft: 4 }}
              />
            ) : (
              <IoniconsIcon
                name={getLocationIcon()}
                size={16}
                color={getLocationIconColor()}
                style={{ marginLeft: 4 }}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Right Section - Notification and Cart Icons */}
      <View className="flex-row items-center" style={{ gap: 12 }}>
        {/* Notification Icon */}
        <TouchableOpacity
          onPress={handleNotificationPress}
          className="relative"
          activeOpacity={0.7}
        >
          <View
            className="w-12 h-12 rounded-full items-center justify-center"
            style={{
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.outline,
            }}
          >
            <IoniconsIcon
              name="notifications-outline"
              size={22}
              color={colors.onSurface}
            />
          </View>
          <NotificationBadge
            count={unreadNotificationCount}
            position="top-right"
            offset={{ x: 6, y: 6 }}
          />
        </TouchableOpacity>

        {/* Cart Icon */}
        <TouchableOpacity
          onPress={handleCartPress}
          className="relative"
          activeOpacity={0.7}
        >
          <View
            className="w-12 h-12 rounded-full items-center justify-center"
            style={{
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.outline,
            }}
          >
            <IoniconsIcon
              name="bag-outline"
              size={22}
              color={colors.onSurface}
            />
          </View>
          {cartItemCount > 0 && (
            <Badge
              size={18}
              style={{
                position: 'absolute',
                top: -2,
                right: -2,
                backgroundColor: colors.primary,
              }}
            >
              {cartItemCount > 99 ? '99+' : cartItemCount}
            </Badge>
          )}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(HomeHeader);
