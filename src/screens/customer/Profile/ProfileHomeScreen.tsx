import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import React, { useCallback } from 'react';
import { Avatar, Switch, useTheme } from 'react-native-paper';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import RowView from '@/src/components/common/RowView';
import { CustomerProfileStackScreenProps } from '@/src/navigation/types';
import CommonView from '@/src/components/common/CommonView';
import { useAppStore } from '@/src/stores/AppStore';
import { useAuthStore, useCustomerProfile } from '@/src/stores/AuthStore';
import { useBottomSheet } from '@/src/components/common/BottomSheet/BottomSheetContext';
import LogoutContent from '@/src/components/common/BottomSheet/LogoutContent';
import { icons } from '@/assets/images';
import { useTranslation } from 'react-i18next';

const ProfileHomeScreen = ({
  navigation,
}: CustomerProfileStackScreenProps<'ProfileHome'>) => {
  const { colors } = useTheme();
  const theme = useAppStore((state) => state.theme);
  const setTheme = useAppStore((state) => state.setTheme);
  const logout = useAuthStore((state) => state.logout);
  const user = useCustomerProfile();
  const { present, dismiss, isPresented } = useBottomSheet();
  const { t } = useTranslation('translation');

  const handleLogout = useCallback(() => {
    try {
      console.log('Logging out user');
      logout();
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert(t('error'), t('failed_to_logout'));
    }
  }, [logout, t]);

  const showLogoutModal = useCallback(() => {
    // Prevent multiple presentations
    if (isPresented) {
      return;
    }

    try {
      console.log('Attempting to show logout modal...');

      present(
        <LogoutContent onDismiss={dismiss} onConfirmLogout={handleLogout} />,
        {
          snapPoints: ['50%'],
          enablePanDownToClose: true,
          title: t('confirm_logout'),
          showHandle: true,
          backdropOpacity: 0.5,
        },
      );
    } catch (error) {
      console.error('Failed to present logout modal:', error);
      // Fallback to Alert
      Alert.alert(t('confirm_logout'), t('are_you_sure_you_want_to_log_out'), [
        { text: t('cancel'), style: 'cancel' },
        { text: t('log_out'), style: 'destructive', onPress: handleLogout },
      ]);
    }
  }, [isPresented, present, dismiss, handleLogout, t]);

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

  const navigateToProfileDetails = useCallback(() => {
    navigation.navigate('ProfileDetails');
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

  // Notification handler
  const handleNotificationPress = useCallback(() => {
    navigation.navigate('Notifications');
  }, [navigation]);

  // Placeholder handlers for incomplete features
  const handleSpecialOffersPress = useCallback(() => {
    Alert.alert(t('info'), t('special_offers_feature_coming_soon'));
  }, [t]);

  const handleSecurityPress = useCallback(() => {
    Alert.alert(t('info'), t('security_settings_coming_soon'));
  }, [t]);

  return (
    <CommonView>
      <ScrollView
        className="flex-1 h-full py-3 px-1"
        showsVerticalScrollIndicator={false}
      >
        {/* Profile section */}
        <View className="flex-row justify-between items-center mb-3 px-1">
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
              {user?.fullName || t('full_name')}
            </Text>
            {user?.email && (
              <Text
                style={{ color: colors.onSurfaceVariant }}
                className="text-sm mt-1"
              >
                {user.email}
              </Text>
            )}
            {user?.phoneNumber && (
              <Text
                style={{ color: colors.onSurfaceVariant }}
                className="text-sm"
              >
                {user.phoneNumber}
              </Text>
            )}
            {user?.status && (
              <Text
                style={{ 
                  color: user.status === 'active' ? '#00D084' : colors.onSurfaceVariant,
                  fontSize: 12,
                  fontWeight: '500',
                  marginTop: 4,
                  textTransform: 'capitalize'
                }}
              >
                {user.status}
              </Text>
            )}
          </View>
          <TouchableOpacity activeOpacity={0.7} onPress={navigateToEditProfile}>
            <AntDesign name="edit" color={'#007aff'} size={25} />
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View
          className="h-[1px] mx-1 my-4"
          style={{ backgroundColor: colors.outline }}
        />

        {/* Menu items */}
        <RowView
          title={t('profile_details')}
          subtitle={t('view_and_edit_your_personal_information')}
          onPress={navigateToProfileDetails}
          leftIconName="person-outline"
        />
        <RowView
          title={t('my_favorite_restaurants')}
          subtitle={t('manage_your_saved_restaurants')}
          onPress={navigateToFavoriteRestaurants}
          leftIconName="fast-food-outline"
        />
        <RowView
          title={t('special_offers_and_promo')}
          subtitle={t('view_available_discounts_and_deals')}
          onPress={handleSpecialOffersPress}
          leftIconName="gift-outline"
        />
        <RowView
          title={t('payment_method')}
          subtitle={t('manage_your_payment_options')}
          onPress={navigateToPaymentMethods}
          leftIconName="card-outline"
        />

        <View
          className="h-[1px] mx-1 mb-4"
          style={{ backgroundColor: colors.outline }}
        />

        <RowView
          title={t('address')}
          subtitle={t('manage_your_delivery_addresses')}
          onPress={navigateToAddress}
          leftIconName="location-outline"
        />
        <RowView
          title={t('notification')}
          subtitle={t('customize_your_notification_preferences')}
          onPress={handleNotificationPress}
          leftIconName="notifications-outline"
        />
        <RowView
          title={t('security')}
          subtitle={t('manage_password_and_security_settings')}
          onPress={handleSecurityPress}
          leftIconName="shield-checkmark-outline"
        />
        <RowView
          title={t('help')}
          subtitle={t('get_support_and_contact_us')}
          onPress={navigateToHelp}
          leftIconName="help-circle-outline"
        />

        {/* Dark Mode Toggle */}
        <View className="flex-row justify-between mb-4 items-center px-2 py-2">
          <MaterialIcons
            name={isDarkMode ? 'dark-mode' : 'light-mode'}
            size={25}
            color={colors.onSurface}
          />
          <View className="flex-1 ml-3">
            <Text
              className="font-semibold text-base"
              style={{ color: colors.onSurface }}
            >
              {t('dark_mode')}
            </Text>
            <Text
              className="text-sm mt-1"
              style={{ color: colors.onSurfaceVariant }}
            >
              {t('switch_between_light_and_dark_themes')}
            </Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={handleThemeToggle}
            thumbColor={isDarkMode ? '#007aff' : '#f4f3f4'}
            trackColor={{ false: '#767577', true: '#007aff' }}
          />
        </View>

        <RowView
          title={t('language_screen')}
          subtitle={t('change_app_language_preferences')}
          onPress={navigateToLanguage}
          leftIconName="language-outline"
        />

        {/* Logout Row */}
        <RowView
          title={t('logout')}
          subtitle={t('sign_out_of_your_account')}
          onPress={showLogoutModal}
          leftIconName="log-out-outline"
        />
      </ScrollView>
    </CommonView>
  );
};

export default ProfileHomeScreen;
