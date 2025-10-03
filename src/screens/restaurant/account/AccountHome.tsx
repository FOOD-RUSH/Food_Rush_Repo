import { MaterialCommunityIcon } from '@/src/components/common/icons';
import React, { useCallback, useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { useTheme, Card, Avatar, Button, Switch } from 'react-native-paper';

import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

import CommonView from '@/src/components/common/CommonView';
import { RestaurantAccountStackScreenProps } from '@/src/navigation/types';
import {
  useRestaurantProfile as useAuthRestaurantProfile,
  useRestaurantInfo,
  useLogout,
} from '@/src/stores/AuthStore';
import {
  useRestaurantProfile,
  useRestaurantStatus,
} from '@/src/hooks/restaurant/useRestaurantProfile';
import { useFloatingTabBarHeight } from '@/src/hooks/useFloatingTabBarHeight';

const { width: screenWidth } = Dimensions.get('window');

interface MenuItemProps {
  icon: string;
  title: string;
  subtitle: string;
  onPress: () => void;
  color?: string;
  showBadge?: boolean;
  badgeText?: string;
}

const MenuItem: React.FC<MenuItemProps> = React.memo(
  ({ icon, title, subtitle, onPress, color, showBadge = false, badgeText }) => {
    const { colors } = useTheme();
    const iconColor = color || colors.primary;

    return (
      <TouchableOpacity
        onPress={onPress}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 16,
          paddingHorizontal: 20,
          borderBottomWidth: 1,
          borderBottomColor: colors.outline + '20',
        }}
        activeOpacity={0.7}
      >
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: iconColor + '15',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 16,
          }}
        >
          <MaterialCommunityIcon             name={icon as any}
            size={22}
            color={iconColor}
          />
        </View>

        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: colors.onSurface,
                flex: 1,
              }}
            >
              {title}
            </Text>
            {showBadge && badgeText && (
              <View
                style={{
                  backgroundColor: colors.primary,
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 10,
                  marginLeft: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: '600',
                    color: colors.onPrimary,
                  }}
                >
                  {badgeText}
                </Text>
              </View>
            )}
          </View>
          <Text
            style={{
              fontSize: 13,
              color: colors.onSurfaceVariant,
              marginTop: 2,
              lineHeight: 18,
            }}
          >
            {subtitle}
          </Text>
        </View>

        <MaterialCommunityIcon           name="chevron-right"
          size={20}
          color={colors.onSurfaceVariant}
          style={{ marginLeft: 12 }}
        />
      </TouchableOpacity>
    );
  },
);
MenuItem.displayName = 'MenuItem';
const AccountHome: React.FC<
  RestaurantAccountStackScreenProps<'AccountHome'>
> = ({ navigation }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const user = useAuthRestaurantProfile();
  const tabBarHeight = useFloatingTabBarHeight();
  const { currentRestaurant } = useRestaurantInfo();
  const logout = useLogout();

  // Use new restaurant profile hook
  const {
    restaurantProfile,
    isLoading: profileLoading,
    loadProfileIfNeeded,
  } = useRestaurantProfile();

  const {
    isOpen: statusIsOpen,
    isUpdating,
    toggleStatus,
  } = useRestaurantStatus();

  // Local state for UI responsiveness
  const [isRestaurantOpen, setIsRestaurantOpen] = useState(statusIsOpen);

  // Load restaurant profile when screen is first visited
  useEffect(() => {
    loadProfileIfNeeded();
  }, [loadProfileIfNeeded]);

  // Sync local state with store state
  useEffect(() => {
    setIsRestaurantOpen(statusIsOpen);
  }, [statusIsOpen]);

  const handleLogout = useCallback(() => {
    console.log('Logout button pressed');
    Alert.alert(t('logout'), t('are_you_sure_logout'), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('logout'),
        style: 'destructive',
        onPress: async () => {
          try {
            console.log('User confirmed logout, starting logout process...');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            console.log('Calling logout function...');
            await logout();
            console.log('Logout function completed successfully');
          } catch (error) {
            console.error('Logout error in AccountHome:', error);
            Alert.alert(
              'Logout Error',
              'There was an error logging out. Please try again.',
              [{ text: 'OK' }],
            );
          }
        },
      },
    ]);
  }, [t, logout]);

  const handleStatusToggle = useCallback(async () => {
    const newStatus = !isRestaurantOpen;

    if (isRestaurantOpen) {
      // Going offline - show confirmation
      Alert.alert(
        t('close_restaurant'),
        t('confirm_close_restaurant_message'),
        [
          { text: t('cancel'), style: 'cancel' },
          {
            text: t('close'),
            style: 'destructive',
            onPress: async () => {
              try {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setIsRestaurantOpen(false);
                await toggleStatus(false);
                console.log('Restaurant closed successfully');
                Haptics.notificationAsync(
                  Haptics.NotificationFeedbackType.Success,
                );
              } catch (error) {
                console.error('Failed to close restaurant:', error);
                setIsRestaurantOpen(true);
              }
            },
          },
        ],
      );
    } else {
      // Going online - no confirmation needed
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setIsRestaurantOpen(true);
        await toggleStatus(true);
        console.log('Restaurant opened successfully');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (error) {
        console.error('Failed to open restaurant:', error);
        setIsRestaurantOpen(false);
      }
    }
  }, [isRestaurantOpen, toggleStatus, t]);

  // Memoize user display data to prevent recalculations
  const userDisplayData = useMemo(() => {
    const displayName = user?.fullName || 'Restaurant Owner';
    const displayEmail = user?.email || 'owner@restaurant.com';
    // Use restaurant profile name first, then fallback to current restaurant or user business name
    const restaurantDisplayName =
      restaurantProfile?.name ||
      currentRestaurant?.name ||
      user?.businessName ||
      'My Restaurant';
    const avatarLabel = user?.fullName
      ? user.fullName
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
      : restaurantDisplayName
        ? restaurantDisplayName
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
        : 'R';

    return {
      displayName,
      displayEmail,
      restaurantName: restaurantDisplayName,
      avatarLabel,
    };
  }, [
    user?.fullName,
    user?.email,
    user?.businessName,
    restaurantProfile?.name,
    currentRestaurant?.name,
  ]);

  // Memoize menu items to prevent recreation
  const menuItems = useMemo(
    () => [
      {
        icon: 'account-edit',
        title: t('edit_profile'),
        subtitle: t('update_personal_and_restaurant_information'),
        onPress: () => navigation.navigate('RestaurantEditProfile'),
        color: colors.primary,
      },
      {
        icon: 'map-marker-outline',
        title: t('restaurant_location'),
        subtitle: t('manage_address_and_delivery_zones'),
        onPress: () => navigation.navigate('RestaurantLocation'),
        color: '#00D084',
      },

      {
        icon: 'bell-outline',
        title: t('notifications'),
        subtitle: t('manage_notification_preferences'),
        onPress: () => navigation.navigate('RestaurantNotifications'),
        color: '#8B5CF6',
      },
      {
        icon: 'palette-outline',
        title: t('appearance_language'),
        subtitle: t('theme_language_preferences'),
        onPress: () => navigation.navigate('RestaurantThemeSettings'),
        color: '#FF9500',
      },

      {
        icon: 'help-circle-outline',
        title: t('help_support'),
        subtitle: t('faq_contact_support_team'),
        onPress: () => navigation.navigate('RestaurantSupport'),
        color: colors.primary,
      },
      {
        icon: 'information-outline',
        title: t('about'),
        subtitle: t('app_version_terms_privacy'),
        onPress: () => navigation.navigate('RestaurantAbout'),
        color: colors.onSurfaceVariant,
      },
    ],
    [t, navigation, colors],
  );

  const statusColor = isRestaurantOpen ? '#00D084' : '#FF3B30';
  const statusText = isRestaurantOpen ? t('open') : t('closed');
  const statusDescription = isRestaurantOpen
    ? t('accepting_orders_normally')
    : t('not_accepting_orders');

  return (
    <CommonView style={{ backgroundColor: colors.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: tabBarHeight }}
      >
        {/* Restaurant Header Card */}
        <Card
          style={{
            backgroundColor: colors.surface,
            marginHorizontal: 8,
            marginTop: 16,
            borderRadius: 20,
            overflow: 'hidden',
          }}
        >
          <LinearGradient
            colors={[colors.primary + '15', colors.primaryContainer + '25']}
            style={{ padding: 8 }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Avatar.Text
                size={64}
                label={userDisplayData.avatarLabel}
                style={{
                  backgroundColor: colors.primary,
                  marginRight: 16,
                }}
                labelStyle={{ fontSize: 22, fontWeight: 'bold' }}
              />

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: colors.onSurface,
                    marginBottom: 4,
                  }}
                >
                  {userDisplayData.restaurantName}
                </Text>

                <Text
                  style={{
                    fontSize: 14,
                    color: colors.onSurfaceVariant,
                    marginBottom: 4,
                  }}
                >
                  {userDisplayData.displayEmail}
                </Text>

                {user?.phoneNumber && (
                  <Text
                    style={{
                      fontSize: 13,
                      color: colors.onSurfaceVariant,
                      marginBottom: 8,
                    }}
                  >
                    📞 {user.phoneNumber}
                  </Text>
                )}

                {/* Status Row */}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      flex: 1,
                    }}
                  >
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: statusColor,
                        marginRight: 8,
                      }}
                    />
                    <View>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: '600',
                          color: statusColor,
                        }}
                      >
                        {statusText}
                      </Text>
                      <Text
                        style={{
                          fontSize: 11,
                          color: colors.onSurfaceVariant,
                        }}
                      >
                        {statusDescription}
                      </Text>
                    </View>
                  </View>

                  <Switch
                    value={isRestaurantOpen}
                    onValueChange={handleStatusToggle}
                    disabled={isUpdating || profileLoading}
                    thumbColor={isRestaurantOpen ? '#00D084' : '#FF3B30'}
                    trackColor={{
                      false: '#FF3B3030',
                      true: '#00D08430',
                    }}
                  />
                </View>
              </View>
            </View>
          </LinearGradient>
        </Card>

        {/* Account Management Section */}
        <View style={{ marginTop: 24 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: colors.onBackground,
              marginHorizontal: 20,
              marginBottom: 12,
            }}
          >
            {t('account_management')}
          </Text>

          <Card
            style={{
              backgroundColor: colors.surface,
              marginHorizontal: 8,
              borderRadius: 16,
              overflow: 'hidden',
            }}
          >
            {menuItems.slice(0, 4).map((item, index) => (
              <MenuItem
                key={index}
                icon={item.icon}
                title={item.title}
                subtitle={item.subtitle}
                onPress={item.onPress}
                color={item.color}
              />
            ))}
          </Card>
        </View>

        {/* App Settings Section */}
        <View style={{ marginTop: 24 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: colors.onBackground,
              marginHorizontal: 20,
              marginBottom: 12,
            }}
          >
            {t('app_settings')}
          </Text>

          <Card
            style={{
              backgroundColor: colors.surface,
              marginHorizontal: 8,
              borderRadius: 16,
              overflow: 'hidden',
            }}
          >
            {menuItems.slice(4).map((item, index) => (
              <MenuItem
                key={index + 4}
                icon={item.icon}
                title={item.title}
                subtitle={item.subtitle}
                onPress={item.onPress}
                color={item.color}
              />
            ))}
          </Card>
        </View>

        {/* Logout Section */}
        <View style={{ marginTop: 32, paddingHorizontal: 16 }}>
          <Button
            mode="contained"
            onPress={handleLogout}
            style={{
              backgroundColor: colors.error,
              borderRadius: 16,
            }}
            contentStyle={{
              paddingVertical: 12,
            }}
            labelStyle={{
              fontSize: 16,
              fontWeight: '600',
              color: 'white',
              fontFamily: 'Urbanist-Bold',
            }}
            icon="logout"
          >
            {t('logout')}
          </Button>

          <Text
            style={{
              textAlign: 'center',
              fontSize: 12,
              color: colors.onSurfaceVariant,
              marginTop: 16,
            }}
          >
            {t('version')} 1.0.0
          </Text>
        </View>
      </ScrollView>
    </CommonView>
  );
};

export default AccountHome;
