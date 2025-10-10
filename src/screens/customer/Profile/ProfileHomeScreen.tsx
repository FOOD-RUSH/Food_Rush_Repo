import { AntDesignIcon, MaterialIcon } from '@/src/components/common/icons';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import React, { useCallback } from 'react';
import { Switch, useTheme } from 'react-native-paper';

import RowView from '@/src/components/common/RowView';
import { CustomerProfileStackScreenProps } from '@/src/navigation/types';
import CommonView from '@/src/components/common/CommonView';
import { useAppStore } from '@/src/stores/AppStore';
import { useAuthStore, useCustomerProfile } from '@/src/stores/AuthStore';
import { useBottomSheet } from '@/src/components/common/BottomSheet/BottomSheetContext';
import LogoutContent from '@/src/components/common/BottomSheet/LogoutContent';
import Avatar from '@/src/components/common/Avatar';
import { useTranslation } from 'react-i18next';
import { useFloatingTabBarHeight } from '@/src/hooks/useFloatingTabBarHeight';
import TermsAndConditionsModal from '@/src/components/common/modals/TermsAndConditionsModal';
import { useTermsModal } from '@/src/hooks/common/useTermsModal';

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
  const tabBarHeight = useFloatingTabBarHeight();
  const { isVisible: showTermsModal, showTerms, hideTerms } = useTermsModal();

  const handleLogout = useCallback(() => {
    try {
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
    navigation.push('EditProfile'); // Use push() to ensure screen appears on top
  }, [navigation]);

  const navigateToProfileDetails = useCallback(() => {
    navigation.navigate('ProfileDetails');
  }, [navigation]);

  const navigateToFavoriteRestaurants = useCallback(() => {
    navigation.navigate('FavoriteRestaurantScreen');
  }, [navigation]);

  const navigateToTransactionHistory = useCallback(() => {
    navigation.push('TransactionHistory'); // Use push() to ensure screen appears on top
  }, [navigation]);

  const navigateToAddress = useCallback(() => {
    navigation.push('AddressScreen'); // Use push() to ensure screen appears on top
  }, [navigation]);

  const navigateToHelp = useCallback(() => {
    navigation.navigate('Help', { screen: 'ContactUs' });
  }, [navigation]);

  const navigateToLanguage = useCallback(() => {
    navigation.navigate('LanguageScreen');
  }, [navigation]);

  // Notification handler
  const handleNotificationPress = useCallback(() => {
    navigation.push('Notifications'); // Use push() to ensure screen appears on top
  }, [navigation]);

  // Placeholder handlers for incomplete features
  const handleSpecialOffersPress = useCallback(() => {
    Alert.alert(t('info'), t('special_offers_feature_coming_soon'));
  }, [t]);

  const handleSecurityPress = useCallback(() => {
    Alert.alert(t('info'), t('security_settings_coming_soon'));
  }, [t]);

  const handleTermsPress = useCallback(() => {
    showTerms();
  }, [showTerms]);

  return (
    <CommonView>
      <ScrollView
        className="flex-1 h-full py-3 px-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: tabBarHeight,
        }}
      >
        {/* Profile section */}
        <View className="flex-row justify-between items-center mb-3 px-1">
          <Avatar
            profilePicture={user?.profilePicture}
            fullName={user?.fullName || 'User'}
            size={100}
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
                  color:
                    user.status === 'active'
                      ? '#00D084'
                      : colors.onSurfaceVariant,
                  fontSize: 12,
                  fontWeight: '500',
                  marginTop: 4,
                  textTransform: 'capitalize',
                }}
              >
                {user.status}
              </Text>
            )}
          </View>
          <TouchableOpacity activeOpacity={0.7} onPress={navigateToEditProfile}>
            <AntDesignIcon name="edit" color={'#007aff'} size={25} />
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
          iconColor={colors.primary}
          showIconBackground={true}
        />
        <RowView
          title={t('my_favorite_restaurants')}
          subtitle={t('manage_your_saved_restaurants')}
          onPress={navigateToFavoriteRestaurants}
          leftIconName="fast-food-outline"
          iconColor="#FF6B35"
          showIconBackground={true}
        />
        <RowView
          title={t('special_offers_and_promo')}
          subtitle={t('view_available_discounts_and_deals')}
          onPress={handleSpecialOffersPress}
          leftIconName="gift-outline"
          iconColor="#00D084"
          showIconBackground={true}
        />
        <RowView
          title={t('transaction_history')}
          subtitle={t('view_payment_information')}
          onPress={navigateToTransactionHistory}
          leftIconName="receipt-outline"
          iconColor="#8B5CF6"
          showIconBackground={true}
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
          iconColor="#FF9500"
          showIconBackground={true}
        />
        <RowView
          title={t('notification')}
          subtitle={t('customize_your_notification_preferences')}
          onPress={handleNotificationPress}
          leftIconName="notifications-outline"
          iconColor="#007AFF"
          showIconBackground={true}
        />
        <RowView
          title={t('security')}
          subtitle={t('manage_password_and_security_settings')}
          onPress={handleSecurityPress}
          leftIconName="shield-checkmark-outline"
          iconColor="#34C759"
          showIconBackground={true}
        />
        <RowView
          title={t('help')}
          subtitle={t('get_support_and_contact_us')}
          onPress={navigateToHelp}
          leftIconName="help-circle-outline"
          iconColor={colors.primary}
          showIconBackground={true}
        />
        <RowView
          title={t('terms_and_conditions')}
          subtitle={t('view_our_terms_of_service')}
          onPress={handleTermsPress}
          leftIconName="document-text-outline"
          iconColor="#6B7280"
          showIconBackground={true}
        />

        {/* Dark Mode Toggle */}
        <View className="flex-row justify-between mb-4 items-center px-2 py-2">
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: isDarkMode ? '#FFD700' : '#007aff',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <MaterialIcon
              name={isDarkMode ? 'dark-mode' : 'light-mode'}
              size={22}
              color={isDarkMode ? '#1a1a1a' : '#ffffff'}
            />
          </View>
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
          iconColor="#5856D6"
          showIconBackground={true}
        />

        {/* Logout Row */}
        <RowView
          title={t('logout')}
          subtitle={t('sign_out_of_your_account')}
          onPress={showLogoutModal}
          leftIconName="log-out-outline"
          iconColor="#FF3B30"
          showIconBackground={true}
        />
      </ScrollView>

      {/* Terms and Conditions Modal */}
      <TermsAndConditionsModal
        visible={showTermsModal}
        onDismiss={hideTerms}
        userType="customer"
      />
    </CommonView>
  );
};

export default ProfileHomeScreen;
