import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { useTheme, Card, Avatar, Button, Switch } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

import CommonView from '@/src/components/common/CommonView';
import { RestaurantAccountStackScreenProps } from '@/src/navigation/types';
import { useRestaurantProfile, useRestaurantInfo, useLogout } from '@/src/stores/AuthStore';
import { useToggleRestaurantStatus } from '@/src/hooks/restaurant/useRestaurantApi';

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

const MenuItem: React.FC<MenuItemProps> = React.memo(({ 
  icon, 
  title, 
  subtitle, 
  onPress, 
  color,
  showBadge = false,
  badgeText
}) => {
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
        <MaterialCommunityIcons
          name={icon as any}
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
      
      <MaterialCommunityIcons
        name="chevron-right"
        size={20}
        color={colors.onSurfaceVariant}
        style={{ marginLeft: 12 }}
      />
    </TouchableOpacity>
  );
});

const AccountHome: React.FC<
  RestaurantAccountStackScreenProps<'AccountHome'>
> = ({ navigation }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const user = useRestaurantProfile();
  const { currentRestaurant } = useRestaurantInfo();
  const logout = useLogout();
  
  // Restaurant status state
  const [isRestaurantOpen, setIsRestaurantOpen] = useState(currentRestaurant?.isOpen || false);
  const restaurantId = currentRestaurant?.id;
  const toggleStatusMutation = useToggleRestaurantStatus(
    isRestaurantOpen,
    restaurantId || '',
  );

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
            Alert.alert('Logout Error', 'There was an error logging out. Please try again.', [
              { text: 'OK' }
            ]);
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
                if (restaurantId) {
                  await toggleStatusMutation.mutateAsync();
                }
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              } catch (error) {
                console.error('Failed to update status:', error);
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
        if (restaurantId) {
          await toggleStatusMutation.mutateAsync();
        }
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (error) {
        console.error('Failed to update status:', error);
        setIsRestaurantOpen(false);
      }
    }
  }, [isRestaurantOpen, restaurantId, toggleStatusMutation, t]);

  // Memoize user display data to prevent recalculations
  const userDisplayData = useMemo(() => {
    const displayName = user?.fullName || 'Restaurant Owner';
    const displayEmail = user?.email || 'owner@restaurant.com';
    const restaurantName = currentRestaurant?.name || user?.businessName || 'My Restaurant';
    const avatarLabel = user?.fullName
      ? user.fullName
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
      : restaurantName
      ? restaurantName
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
      : 'R';
    
    return { displayName, displayEmail, restaurantName, avatarLabel };
  }, [user?.fullName, user?.email, user?.businessName, currentRestaurant?.name]);

  // Memoize menu items to prevent recreation
  const menuItems = useMemo(() => [
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
      icon: 'credit-card-outline',
      title: t('payment_billing'),
      subtitle: t('manage_payment_methods_and_billing'),
      onPress: () => navigation.navigate('RestaurantPaymentBilling'),
      color: '#FF6B35',
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
      icon: 'cog-outline',
      title: t('settings'),
      subtitle: t('restaurant_management_and_preferences'),
      onPress: () => navigation.navigate('RestaurantSettings'),
      color: colors.onSurfaceVariant,
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
  ], [t, navigation, colors]);

  const statusColor = isRestaurantOpen ? '#00D084' : '#FF3B30';
  const statusText = isRestaurantOpen ? t('open') : t('closed');
  const statusDescription = isRestaurantOpen
    ? t('accepting_orders_normally')
    : t('not_accepting_orders');

  return (
    <CommonView style={{ backgroundColor: colors.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Restaurant Header Card */}
        <Card
          style={{
            backgroundColor: colors.surface,
            marginHorizontal: 16,
            marginTop: 16,
            borderRadius: 20,
            overflow: 'hidden',
          }}
        >
          <LinearGradient
            colors={[colors.primary + '15', colors.primaryContainer + '25']}
            style={{ padding: 20 }}
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
                <View style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: colors.surface,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 12,
                }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
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
                    disabled={toggleStatusMutation.isPending}
                    thumbColor={isRestaurantOpen ? '#00D084' : '#FF3B30'}
                    trackColor={{
                      false: '#FF3B3030',
                      true: '#00D08430',
                    }}
                  />
                </View>
              </View>
            </View>

            {/* User Role and Status Badges */}
            <View style={{ flexDirection: 'row', marginTop: 12, gap: 8 }}>
              <View
                style={{
                  backgroundColor: colors.primary,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 16,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '600',
                    color: colors.onPrimary,
                    textTransform: 'capitalize',
                  }}
                >
                  {user?.role || 'Restaurant Owner'}
                </Text>
              </View>
              
              {user?.status && (
                <View
                  style={{
                    backgroundColor: user.status === 'active' ? '#00D084' : 
                                   user.status === 'pending_verification' ? '#FF9500' : '#FF3B30',
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 16,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '600',
                      color: 'white',
                      textTransform: 'capitalize',
                    }}
                  >
                    {user.status.replace('_', ' ')}
                  </Text>
                </View>
              )}
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
              marginHorizontal: 16,
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
              marginHorizontal: 16,
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