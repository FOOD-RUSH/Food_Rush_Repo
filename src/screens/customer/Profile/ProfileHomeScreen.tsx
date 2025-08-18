import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React, { useCallback } from 'react';
import { Avatar, Switch, useTheme } from 'react-native-paper';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import RowView from '@/src/components/common/RowView';
import { CustomerProfileStackScreenProps } from '@/src/navigation/types';
import CommonView from '@/src/components/common/CommonView';
import { useAppStore } from '@/src/stores/customerStores/AppStore';
import { useAuthStore } from '@/src/stores/customerStores/AuthStore';
import { useCurrentUser } from '@/src/hooks/customer/useAuthhooks';
import { useBottomSheet } from '@/src/components/common/BottomSheet/BottomSheetContext';
import LogoutContent from '@/src/components/common/BottomSheet/LogoutContent';
import { icons } from '@/assets/images';

const ProfileHomeScreen = ({
  navigation,
}: CustomerProfileStackScreenProps<'ProfileHome'>) => {
  const { data: user } = useCurrentUser();
  const { colors } = useTheme();
  const theme = useAppStore((state) => state.theme);
  const setTheme = useAppStore((state) => state.setTheme);
  const logoutUser = useAuthStore((state) => state.logoutUser);
  const { present, dismiss } = useBottomSheet();

  const handleLogout = useCallback(() => {
    console.log('Logging out user');
    logoutUser();
    dismiss();
  }, [logoutUser, dismiss]);

  const showLogoutModal = useCallback(() => {
    present(
      <LogoutContent onDismiss={dismiss} onConfirmLogout={handleLogout} />,
      {
        snapPoints: ['40%'],
        enablePanDownToClose: true,
        title: 'Confirm Logout',
        showHandle: true,
      },
    );
  }, [present, dismiss, handleLogout]);

  const handleThemeToggle = useCallback(
    (value: boolean) => {
      const newTheme = value ? 'dark' : 'light';
      setTheme(newTheme);
    },
    [setTheme],
  );

  const isDarkMode = theme === 'dark';

  // Navigation handlers
  const navigateToEditProfile = useCallback(() => {
    navigation.navigate('EditProfile');
  }, [navigation]);

  const navigateToFavoriteRestaurants = useCallback(() => {
    navigation.navigate('FavoriteRestaurantScreen');
  }, [navigation]);

  const navigateToPaymentMethods = useCallback(() => {
    navigation.navigate('PaymentMethods');
  }, [navigation]);

  const navigateToAddress = useCallback(() => {
    navigation.navigate('AddressScreen');
  }, [navigation]);

  const navigateToHelp = useCallback(() => {
    navigation.navigate('Help', { screen: 'ContactUs' });
  }, [navigation]);

  const navigateToLanguage = useCallback(() => {
    navigation.navigate('LanguageScreen');
  }, [navigation]);

  return (
    <CommonView>
      <ScrollView
        className="flex-1 h-full py-3"
        showsVerticalScrollIndicator={false}
      >
        {/* Profile section */}
        <View className="flex-row justify-between items-center mb-3 px-2">
          <Avatar.Image
            source={icons.ProfilePlogo}
            size={100}
            className="bg-gray-500"
          />
          <View className="flex-col items-center justify-center flex-1 mx-2">
            <Text
              style={{ color: colors.onBackground }}
              className="font-semibold text-[18px]"
            >
              {user?.fullName}
            </Text>
            <Text
              style={{ color: colors.onSurfaceVariant }}
              className="text-[15px]"
            >
              ID: {user?.phoneNumber}
            </Text>
          </View>
          <TouchableOpacity activeOpacity={0.7} onPress={navigateToEditProfile}>
            <AntDesign name="edit" color={'#007aff'} size={25} />
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View
          className="h-[1px] mx-3 my-4"
          style={{ backgroundColor: colors.outline }}
        />

        {/* Menu items */}
        <RowView
          title=" My Favorite Restaurants"
          onPress={navigateToFavoriteRestaurants}
          leftIconName="fast-food-outline"
        />
        <RowView
          title=" Special Offers and Promo"
          onPress={() => {}}
          leftIconName="gift-outline"
        />
        <RowView
          title="Payment Method"
          onPress={navigateToPaymentMethods}
          leftIconName="card-outline"
        />

        <View
          className="h-[1px] mx-3 mb-4"
          style={{ backgroundColor: colors.outline }}
        />

        <RowView
          title="Address"
          onPress={navigateToAddress}
          leftIconName="location-outline"
        />
        <RowView
          title="Notification"
          onPress={() => {}}
          leftIconName="notifications-outline"
        />
        <RowView
          title="Security"
          onPress={() => {}}
          leftIconName="shield-checkmark-outline"
        />
        <RowView
          title="Help"
          onPress={navigateToHelp}
          leftIconName="help-circle-outline"
        />

        {/* Dark Mode Toggle */}
        <View className="flex-row justify-between mb-4 items-center px-4 py-2">
          <MaterialIcons
            name={isDarkMode ? 'dark-mode' : 'light-mode'}
            size={25}
            color={colors.onSurface}
          />
          <Text
            className="font-semibold text-base flex-1 text-center ml-3"
            style={{ color: colors.onSurface }}
          >
            Dark Mode
          </Text>
          <Switch
            value={isDarkMode}
            onValueChange={handleThemeToggle}
            thumbColor={isDarkMode ? '#007aff' : '#f4f3f4'}
            trackColor={{ false: '#767577', true: '#007aff' }}
          />
        </View>

        <RowView
          title="Language Screen"
          onPress={navigateToLanguage}
          leftIconName="language-outline"
        />

        {/* Logout Row */}
        <RowView
          title="Logout"
          onPress={showLogoutModal}
          leftIconName="log-out-outline"
        />
      </ScrollView>
    </CommonView>
  );
};

export default ProfileHomeScreen;
