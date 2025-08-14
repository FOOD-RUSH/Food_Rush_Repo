import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState, useCallback } from 'react';
import { Avatar, Switch, useTheme } from 'react-native-paper';
import { icons } from '@/assets/images';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import RowView from '@/src/components/common/RowView';
import { CustomerProfileStackScreenProps } from '@/src/navigation/types';
import CommonView from '@/src/components/common/CommonView';
import { useAppStore } from '@/src/stores/customerStores/AppStore';
import LogoutModal from '@/src/components/customer/LogoutModal';
import { useAuthStore } from '@/src/stores/customerStores/AuthStore';
import { authApi } from '@/src/services/customer/authApi';
import { useQuery } from '@tanstack/react-query';

const ProfileHomeScreen = ({
  navigation,
}: CustomerProfileStackScreenProps<'ProfileHome'>) => {
  const { data } = useQuery({
    queryKey: ['userData'],
    queryFn: () => {
      console.log('fetching profile data ....');
      return authApi.getProfile();
    },
    staleTime: 5 * 60,
  });

  const { colors } = useTheme();
  const theme = useAppStore((state) => state.theme);
  const setTheme = useAppStore((state) => state.setTheme);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const logoutUser = useAuthStore((state) => state.logoutUser);
  const handleLogout = () => {
    console.log('User logged out');
    logoutUser();
  };

  const showLogoutModal = () => {
    console.log(data);
    setLogoutModalVisible(true);
  };

  // Memoized theme toggle handler for better performance
  const handleThemeToggle = useCallback(
    (value: boolean) => {
      const newTheme = value ? 'dark' : 'light';
      setTheme(newTheme);
    },
    [setTheme],
  );

  const isDarkMode = theme === 'dark';

  return (
    <CommonView>
      <ScrollView
        className="flex-1 h-full py-3"
        style={{ backgroundColor: colors.background }}
        showsVerticalScrollIndicator={false}
      >
        {/* profile pic and stuff */}
        <View className="flex-row justify-between items-center mb-3 px-3">
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
              {data?.data!.email} 124
            </Text>

            <Text
              style={{ color: colors.onSurfaceVariant }}
              className="text-[15px]"
            >
              {/* {formatPhoneNumber(LoggedInUser.data.phoneNumner)} */}
              {data?.data!.role}
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              console.log(data?.data!);
              navigation.navigate('EditProfile');
            }}
          >
            <AntDesign name="edit" color={'#007aff'} size={25} />
          </TouchableOpacity>
        </View>

        {/* divider */}
        <View
          className="h-[1px] mx-3 my-4"
          style={{ backgroundColor: colors.outline }}
        />

        <RowView
          title=" My Favorite Restaurants"
          onPress={() => {
            navigation.navigate('FavoriteRestaurantScreen');
          }}
          leftIconName="fast-food-outline"
        />
        <RowView
          title=" Special Offers and Promo"
          onPress={() => {}}
          leftIconName="gift-outline"
        />
        <RowView
          title="Payment Method"
          onPress={() => {
            navigation.navigate('PaymentMethods');
          }}
          leftIconName="card-outline"
        />

        <View
          className="h-[1px] mx-3 mb-4"
          style={{ backgroundColor: colors.outline }}
        />

        <RowView
          title="Address"
          onPress={() => {
            navigation.navigate('AddressScreen');
          }}
          leftIconName="location-outline"
        />

        {/* notification settings */}
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
          onPress={() => {
            navigation.navigate('Help', { screen: 'ContactUs' });
          }}
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
          onPress={() => {
            navigation.navigate('LanguageScreen');
          }}
          leftIconName="language-outline"
        />

        {/* Logout Row */}
        <RowView
          title="Logout"
          onPress={showLogoutModal}
          leftIconName="log-out-outline"
        />
      </ScrollView>

      {/* Logout Modal */}
      <LogoutModal
        visible={logoutModalVisible}
        onDismiss={() => setLogoutModalVisible(false)}
        onConfirmLogout={handleLogout}
      />
    </CommonView>
  );
};

export default ProfileHomeScreen;
