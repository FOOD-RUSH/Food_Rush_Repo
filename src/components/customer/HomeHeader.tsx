import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Avatar, useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { icons } from '@/assets/images';
import type { CustomerHomeStackScreenProps } from '@/src/navigation/types';
import { useTranslation } from 'react-i18next';
import { Location } from '@/src/location';
import { useCartItems } from '@/src/stores/customerStores/cartStore';

interface HomeHeaderProps {
  navigation: CustomerHomeStackScreenProps<'HomeScreen'>['navigation'];
  location: Location | null;
  onLocationPress: () => void;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({
  navigation,
  location,
  onLocationPress,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');
  const cartItems = useCartItems();

  // Calculate total cart items
  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  // Get display address
  const getDisplayAddress = () => {
    if (!location) {
      return t('select_location');
    }

    if (location.city && location.region) {
      return `${location.city}, ${location.region}`;
    }
    if (location.city) {
      return location.city;
    }
    if (location.address) {
      return location.address.length > 30
        ? `${location.address.substring(0, 30)}...`
        : location.address;
    }
    return t('select_location');
  };

  // Handle navigation actions
  const handleNotificationPress = useCallback(() => {
    navigation.navigate('Notifications');
  }, [navigation]);

  const handleCartPress = useCallback(() => {
    navigation.navigate('Cart');
  }, [navigation]);

  return (
    <View
      className="flex-row items-center justify-between px-4 py-4"
      style={{
        backgroundColor: colors.background,
        borderBottomWidth: 1,
        borderBottomColor: colors.outline,
      }}
    >
      {/* Left Section - Avatar and Location */}
      <View className="flex-row items-center flex-1">
        <Avatar.Image
          source={icons.appleIcon}
          size={50}
          style={{ backgroundColor: colors.surfaceVariant }}
        />

        <View className="ml-3 flex-1">
          <Text
            className="text-xs mb-1"
            style={{ color: colors.onSurfaceVariant }}
          >
            {t('deliver_to')}
          </Text>

          <TouchableOpacity
            className="flex-row items-center"
            onPress={onLocationPress}
            activeOpacity={0.7}
          >
            <View className="flex-1">
              <Text
                className="font-medium text-sm"
                style={{ color: colors.onSurface }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {getDisplayAddress()}
              </Text>

              {location?.isFallback && (
                <View className="flex-row items-center mt-1">
                  <View className="px-2 py-0.5 bg-orange-100 rounded-full">
                    <Text className="text-xs text-orange-700 font-medium">
                      {t('default_location')}
                    </Text>
                  </View>
                </View>
              )}
            </View>

            <Ionicons
              name="chevron-down"
              size={16}
              color={colors.onSurfaceVariant}
              style={{ marginLeft: 8 }}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Right Section - Notification and Cart */}
      <View className="flex-row items-center gap-3">
        {/* Notifications Button */}
        <TouchableOpacity
          className="p-2 rounded-full"
          style={{ backgroundColor: colors.surfaceVariant }}
          onPress={handleNotificationPress}
          activeOpacity={0.7}
        >
          <Ionicons
            name="notifications-outline"
            color={colors.onSurface}
            size={22}
          />
        </TouchableOpacity>

        {/* Cart Button with Badge */}
        <TouchableOpacity
          className="p-2 rounded-full relative"
          style={{ backgroundColor: colors.surfaceVariant }}
          onPress={handleCartPress}
          activeOpacity={0.7}
        >
          {/* Cart Badge */}
          {cartItemCount > 0 && (
            <View className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-[18px] h-[18px] items-center justify-center">
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
