import React, { useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Avatar, useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { icons } from '@/assets/images';
import type { CustomerHomeStackScreenProps } from '@/src/navigation/types';
import { useTranslation } from 'react-i18next';
import { Address } from '@/src/location';
import { useCartItems } from '@/src/stores/customerStores/cartStore';
import { FUTURISTIC_FONTS } from '@/src/config/theme';

interface HomeHeaderProps {
  navigation: CustomerHomeStackScreenProps<'HomeScreen'>['navigation'];
  location: Address | null;
  onLocationPress: () => void;
}

const HomeHeader: React.FC<HomeHeaderProps> = React.memo(({
  navigation,
  location,
  onLocationPress,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation('translation');
  const cartItems = useCartItems();

  // Memoize cart count calculation for performance
  const cartItemCount = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  // Hardcoded address for MVP - location system removed
  const displayAddress = useMemo(() => {
    return 'Yaoundé'; // Hardcoded city name
  }, []);

  // Location system removed, no fallback indicator needed

  // Stable navigation handlers
  const handleNotificationPress = useCallback(() => {
    navigation.navigate('Notifications');
  }, [navigation]);

  const handleCartPress = useCallback(() => {
    navigation.navigate('Cart');
  }, [navigation]);

  // Memoize cart badge for performance
  const cartBadge = useMemo(() => {
    if (cartItemCount <= 0) return null;
    
    return (
      <View className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-[18px] h-[18px] items-center justify-center">
        <Text className="text-white text-xs font-bold">
          {cartItemCount > 99 ? '99+' : cartItemCount}
        </Text>
      </View>
    );
  }, [cartItemCount]);

  return (
    <View
      className="flex-row items-center justify-between px-4 py-4"
      style={{
        backgroundColor: colors.background,
      
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
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <View className="flex-1">
              <Text
                className="font-medium text-lg"
                style={{
                  color: colors.onSurface,
                  fontFamily: FUTURISTIC_FONTS.primary.fontFamily,
                }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {displayAddress}
              </Text>
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
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
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
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          {cartBadge}
          <Ionicons name="bag-outline" color={colors.onSurface} size={22} />
        </TouchableOpacity>
      </View>
    </View>
  );
});

HomeHeader.displayName = 'HomeHeader';

export default HomeHeader;
